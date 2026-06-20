# app/modules/auth/services.py
import logging
import secrets
import uuid

from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, status, BackgroundTasks
from sqlalchemy import select, update, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
)
from app.modules.users.models import User
from app.modules.auth.models import RefreshToken, EmailVerificationToken, PasswordResetToken  
from app.modules.auth.schemas import UserLogin, RefreshRequest, RegistrationResponse, EmailRequestSchema
from app.modules.users.schemas import UserCreate
from datetime import datetime, timedelta, timezone
from app.services.email import send_verification_email, send_password_reset_email
from app.modules.users.models import User

logger = logging.getLogger(__name__)

def register_user_workflow(
    db: Session, 
    user_data: UserCreate,
    ip_address: str, 
    user_agent: str,
    background_tasks: BackgroundTasks,
) -> RegistrationResponse:
    
    """
    Registers a new user efficiently using a single atomic database transaction.
    Scales flawlessly by relying on DB constraints instead of pre-checking.
    """
    verification_token = secrets.token_urlsafe(32)
    user_uuid = str(uuid.uuid4())

    try:
        # 1. Build and add the user first
        new_user = User(
            id=user_uuid,
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            is_verified=False,
            is_active=False,
        )
        db.add(new_user)

        # 2. FORCE SQLAlchemy to send the user insert to the DB right now.
        # This triggers the UniqueConstraint check immediately.
        db.flush()

        # 3. If the flush succeeds, it means the email is unique!
        # Now we can safely add the token record.
        verification_record = EmailVerificationToken(
            user_id=user_uuid,
            token=verification_token,
            expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
        )
        db.add(verification_record)

        # 4. Commit everything cleanly
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"User account created successfully: {new_user.email}")

    except IntegrityError as exc:
        db.rollback()
        
        # (Since we flushed the user first, an IntegrityError here means email conflict)
        logger.warning(f"Registration conflict for: {user_data.email}. Details: {exc}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    except Exception as exc:
        db.rollback()
        logger.exception("Unexpected error during registration workflow.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to complete registration.",
        )

    # 5. Background email delivery
    full_name = f"{new_user.first_name} {new_user.last_name}"
    background_tasks.add_task(
        send_verification_email, 
        email=user_data.email,
        full_name=full_name, 
        verification_token=verification_token,
    )

    return RegistrationResponse(
        message="Registration successful. Please check your email to verify your account.",
        requires_verification=True,
    )


def verify_user_email_workflow(db: Session, token: str) -> dict:
    """
    Validates the verification token, activates the user, and marks the token as used.
    """
    # 1. Look up the token in the database
    token_record = (
        db.query(EmailVerificationToken)
        .filter(EmailVerificationToken.token == token)
        .first()
    )

    if not token_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid verification token.",
        )

    # 2. Check if the token has already been used
    if token_record.used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This token has already been used.",
        )

    # 3. Check if the token has expired
    db_expires_at = token_record.expires_at
    if db_expires_at.tzinfo is None:
        db_expires_at = db_expires_at.replace(tzinfo=timezone.utc)

    if datetime.now(timezone.utc) > db_expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired. Please request a new one.",
        )

    # 4. Fetch the associated user
    user = db.query(User).filter(User.id == token_record.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User associated with this token was not found.",
        )

    # 5. Fast-track if the user is already verified and active (e.g. accidental double clicks)
    if user.is_verified and user.is_active:
        return {"message": "Your account is already verified and active. Please log in."}

    # 6. Execute updates inside a single transaction block
    try:
        user.is_verified = True
        user.is_active = True 
        token_record.used = True
        
        db.commit()
        logger.info(f"User email verified and account activated successfully for user_id: {user.id}")
        
    except Exception as exc:
        db.rollback()
        logger.exception(f"Unexpected database error during email verification for token: {token}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to complete email verification due to a server error.",
        )

    return {"message": "Email verified successfully! Your account is active and you can now log in."}


def authenticate_user_workflow(db: Session, credentials: UserLogin) -> tuple[str, str]:
    """Verifies profile status and issues fresh credentials."""
    user = db.execute(
        select(User).where(User.email == credentials.email)
    ).scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )
    
    # Check verification AFTER password and active status checks
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email is not verified. Please check your inbox or request a new verification link.",
        )

    access_token = create_access_token(user.id)
    refresh_token_str, jti, expires_at = create_refresh_token(user.id)

    db_refresh_token = RefreshToken(
        token_jti=jti, user_id=user.id, expires_at=expires_at
    )
    db.add(db_refresh_token)
    db.commit()

    return access_token, refresh_token_str


def rotate_refresh_token_workflow(db: Session, request: RefreshRequest) -> tuple[str, str]:
    """Validates refresh token states, enforcing safety checks against theft/reuse."""
    payload = verify_token(request.refresh_token, expected_type="refresh")
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    jti = payload.get("jti")
    user_id = payload.get("sub")

    if not jti or not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload"
        )

    db_token = db.execute(
        select(RefreshToken).where(
            RefreshToken.token_jti == jti, RefreshToken.user_id == user_id
        )
    ).scalar_one_or_none()

    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found"
        )

    if db_token.is_revoked:
        # Token reuse detected: Nuclear mitigation option
        db.execute(
            update(RefreshToken)
            .where(RefreshToken.user_id == user_id)
            .values(is_revoked=True)
        )
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token reuse detected. All sessions have been revoked.",
        )

    # Revoke old token
    db_token.is_revoked = True

    # Build replacements
    new_access_token = create_access_token(user_id)
    new_refresh_str, new_jti, new_expires = create_refresh_token(user_id)

    new_db_token = RefreshToken(
        token_jti=new_jti, user_id=user_id, expires_at=new_expires
    )
    db.add(new_db_token)
    db.commit()

    return new_access_token, new_refresh_str


def revoke_session_workflow(db: Session, request: RefreshRequest) -> None:
    """Safely tears down a session track on logout."""
    payload = verify_token(request.refresh_token, expected_type="refresh")
    if payload:
        jti = payload.get("jti")
        if jti:
            db_token = db.execute(
                select(RefreshToken).where(RefreshToken.token_jti == jti)
            ).scalar_one_or_none()
            if db_token:
                db_token.is_revoked = True
                db.commit()


def request_password_reset_workflow(db: Session, email: str, background_tasks: BackgroundTasks) -> dict:

    email_normalized = email.strip().lower()
    user = db.execute(select(User).where(User.email == email_normalized)).scalar_one_or_none()

    if not user:
        logger.warning(f"Password reset requested for non-existent email: {email_normalized}")
        return {"message": "If that email exists in our system, we have sent a reset link."}

    recent = db.execute(
        select(PasswordResetToken)
        .where(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.created_at > datetime.now(timezone.utc) - timedelta(minutes=5)
        )
    ).scalar_one_or_none()

    if recent:
        logger.info(f"Rate-limited password reset for user_id: {user.id}")
        return {"message": "Relax, If that email exists in our system, we have sent a reset link."}

    
    db.execute(
        delete(PasswordResetToken).where(PasswordResetToken.user_id == user.id)
    )

    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)

    new_token = PasswordResetToken(
        token=token,
        user_id=user.id,
        expires_at=expires_at,
    )

    db.add(new_token)
    print(new_token)
    
    try:
        db.commit()
    except Exception:
        db.rollback()
        logger.exception(f"Failed to create reset token for: {email_normalized}")
        raise  # Route catches this and returns 500

    background_tasks.add_task(
        send_password_reset_email, email=user.email,full_name=user.full_name,
        reset_token=token
    )

    logger.info(f"Password reset token created for user_id: {user.id}")

    return {"message": "If that email exists in our system, we have sent a reset link."}


def resend_verification_workflow(
    db: Session, email_schema: EmailRequestSchema,   background_tasks: BackgroundTasks
) -> None:
    """Generates a new verification token and sends it via background tasks."""
    
    user = db.execute(select(User).where(User.email == email_schema.email)
    ).scalar_one_or_none()

    # SECURITY: If the user doesn't exist or is already verified, return a silent success message
    if not user or user.is_verified or not user.is_active:
        return

    # 1. Generate your verification token (however your system currently creates it)
    verification_token = secrets.token_urlsafe(32)

    # 2. Hand off to background tasks to keep your API blazing fast
    full_name = f"{user.first_name} {user.last_name}"
    background_tasks.add_task(
        send_verification_email, email=user.email,
        full_name=full_name, 
        verification_token=verification_token,
    )