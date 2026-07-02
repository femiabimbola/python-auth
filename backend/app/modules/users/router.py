# app/modules/users/router.py
from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user, get_current_active_verified_user  
from app.modules.users.models import User           # Updated local module path
from app.modules.users.schemas import UserResponse   # Updated local module path

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user: User = Depends(get_current_active_verified_user),
):
    """
    Requires valid access token + verified email.
    """
    return current_user


# Alternative: unverified users can still see basic info
@router.get("/me/status", response_model=UserResponse)
def read_user_status(
    current_user: User = Depends(get_current_user),
):
    """
    Get current user info even if unverified.
    Useful for "check your email" page or resend verification.
    """
    return current_user