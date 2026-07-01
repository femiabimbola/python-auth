# app/core/dependencies.py
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db             # Imported from its new core home
from app.core.security import verify_token         # Imported from core security
from app.modules.users.models import User         # Imported from user feature domain

# Use HTTPBearer for Authorization header extraction
security = HTTPBearer(auto_error=False)


def get_current_user(
    # credentials: HTTPAuthorizationCredentials = Depends(security),
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency: extracts and validates the access token from the
    Authorization header, then returns the associated User model instance.
    """
    # token = credentials.credentials
    token = credentials.credentials if credentials else request.cookies.get("access_token")
    payload = verify_token(token, expected_type="access")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # SQLAlchemy 2.0 standard: Using select statement instead of db.query()
    statement = select(User).where(User.id == user_id)
    user = db.execute(statement).scalar_one_or_none()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )

    return user


def get_current_active_verified_user(
    user: User = Depends(get_current_user),
) -> User:
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified",
        )
    return user