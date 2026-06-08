# app/modules/auth/services.py
import logging
import secrets
from fastapi import HTTPException, status, BackgroundTasks
from sqlalchemy import select, update
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
from app.modules.auth.models import RefreshToken, EmailVerificationToken
from app.modules.auth.schemas import UserLogin, RefreshRequest, RegistrationResponse
from app.modules.users.schemas import UserCreate
from datetime import datetime, timedelta, timezone
from app.services.email import send_verification_email
from app.modules.users.models import User

logger = logging.getLogger(__name__)

def register_user_workflow(
    db: Session, user_data: UserCreate,
    ip_address: str, user_agent: str,
    background_tasks: BackgroundTasks,
) -> RegistrationResponse:
    
    """
    Registers a new user in an unverified state, generates an email verification
    token, records an audit log, and queues the verification email.
    """

    # 1. Generate a secure, unique verification token
    verification_token = secrets.token_urlsafe(32)

    try:
        # 2. Build the User instance (matching your User model fields)
        new_user = User(
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            is_verified=False,
            is_active=False,
        )
        db.add(new_user)

        # Flush to database transaction to generate `new_user.id` without committing yet
        db.flush()

        # 3. Create the email verification token record
        # Using timezone-aware UTC to align with DateTime(timezone=True)
        verification_record = EmailVerificationToken(
            user_id=new_user.id,
            token=verification_token,
            expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
        )
        db.add(verification_record)

        # 4. Optional: Create Audit Log record if it exists in your schema
        # audit_log = AuditLog(
        #     user_id=new_user.id,
        #     action="USER_REGISTERED",
        #     description=f"New user registration initiated from IP: {ip_address}",
        # )
        # db.add(audit_log)

        # Commit everything safely inside a single database transaction
        db.commit()
        
        logger.info(f"User account created successfully for email: {new_user.email} (ID: {new_user.id})")

    except IntegrityError as exc:
        db.rollback()
        logger.warning(f"Registration failed. Email conflict detected for: {user_data.email}. Details: {exc}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    except Exception as exc:
        db.rollback()
        # logger.exception automatically logs the full stack trace for debugging
        logger.exception("Unexpected error occurred during user registration workflow.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to complete registration",
        )

    # 5. Hand off the email delivery to FastAPI background tasks so the client isn't blocked waiting for SMTP
    full_name = f"{new_user.first_name} {new_user.last_name}"
    background_tasks.add_task(
        send_verification_email, email=user_data.email,
        full_name=full_name, verification_token=verification_token,
    )

    # 6. Return the expected verification-first structure
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
    # Ensure the database datetime is evaluated as UTC to match datetime.now(timezone.utc)
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

    access_token = create_access_token(user.id)
    refresh_token_str, jti, expires_at = create_refresh_token(user.id)

    db_refresh_token = RefreshToken(
        token_jti=jti, user_id=user.id, expires_at=expires_at
    )
    db.add(db_refresh_token)
    db.commit()

    return access_token, refresh_token_str


def rotate_refresh_token_workflow(
    db: Session, request: RefreshRequest
) -> tuple[str, str]:
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
