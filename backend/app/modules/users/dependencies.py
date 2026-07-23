# app/modules/users/dependencies.py

from fastapi import Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.modules.users.models import User


def require_job_seeker(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the current user has JOB_SEEKER role."""
    if not current_user.is_job_seeker:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Job seeker role required."
        )
    return current_user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the current user has ADMIN or SUPERADMIN role."""
    if not (current_user.is_admin or current_user.is_superadmin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin role required."
        )
    return current_user


def require_employer(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the current user has EMPLOYER role."""
    if not current_user.is_employer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Employer role required."
        )
    return current_user


def require_active_verified_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Ensure the current user is active and email-verified."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified"
        )
    return current_user