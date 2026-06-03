# app/modules/users/router.py
from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user  # Updated core path
from app.modules.users.models import User           # Updated local module path
from app.modules.users.schemas import UserResponse   # Updated local module path

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return current_user