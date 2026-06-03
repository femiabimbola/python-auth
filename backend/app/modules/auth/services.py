# app/modules/auth/services.py
from fastapi import HTTPException, status, BackgroundTasks
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
)
from app.modules.users.models import User
from app.modules.auth.models import RefreshToken
from app.modules.auth.schemas import UserLogin, RefreshRequest
from app.modules.users.schemas import UserCreate
from app.services.email import send_welcome_email


def register_user_workflow(db: Session, user_data: UserCreate, background_tasks: BackgroundTasks) -> tuple[str, str]:
    """Handles everything required to sign up a user and create initial sessions."""
    # Check if email already exists
    existing = db.execute(select(User).where(User.email == user_data.email)).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    # Create user profile
    user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        full_name=user_data.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Issue Session tokens
    access_token = create_access_token(user.id)
    refresh_token_str, jti, expires_at = create_refresh_token(user.id)

    db_refresh_token = RefreshToken(token_jti=jti, user_id=user.id, expires_at=expires_at)
    db.add(db_refresh_token)
    db.commit()

    # Hand off notification to infrastructure
    background_tasks.add_task(send_welcome_email, user.email, user.full_name)
    return access_token, refresh_token_str


def authenticate_user_workflow(db: Session, credentials: UserLogin) -> tuple[str, str]:
    """Verifies profile status and issues fresh credentials."""
    user = db.execute(select(User).where(User.email == credentials.email)).scalar_one_or_none()

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

    db_refresh_token = RefreshToken(token_jti=jti, user_id=user.id, expires_at=expires_at)
    db.add(db_refresh_token)
    db.commit()

    return access_token, refresh_token_str


def rotate_refresh_token_workflow(db: Session, request: RefreshRequest) -> tuple[str, str]:
    """Validates refresh token states, enforcing safety checks against theft/reuse."""
    payload = verify_token(request.refresh_token, expected_type="refresh")
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    jti = payload.get("jti")
    user_id = payload.get("sub")

    if not jti or not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    db_token = db.execute(
        select(RefreshToken).where(RefreshToken.token_jti == jti, RefreshToken.user_id == user_id)
    ).scalar_one_or_none()

    if not db_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found")

    if db_token.is_revoked:
        # Token reuse detected: Nuclear mitigation option
        db.execute(update(RefreshToken).where(RefreshToken.user_id == user_id).values(is_revoked=True))
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

    new_db_token = RefreshToken(token_jti=new_jti, user_id=user_id, expires_at=new_expires)
    db.add(new_db_token)
    db.commit()

    return new_access_token, new_refresh_str


def revoke_session_workflow(db: Session, request: RefreshRequest) -> None:
    """Safely tears down a session track on logout."""
    payload = verify_token(request.refresh_token, expected_type="refresh")
    if payload:
        jti = payload.get("jti")
        if jti:
            db_token = db.execute(select(RefreshToken).where(RefreshToken.token_jti == jti)).scalar_one_or_none()
            if db_token:
                db_token.is_revoked = True
                db.commit()