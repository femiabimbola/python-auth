# app/modules/users/schemas.py
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator


class UserCreate(BaseModel):
    """Schema for user registration."""
    email: EmailStr  # Leverages Pydantic's native, robust email validation
    password: str
    full_name: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return v.strip()


class UserResponse(BaseModel):
    """Schema for user data in responses."""
    id: str
    email: EmailStr
    full_name: str
    is_active: bool
    created_at: datetime

    # Pydantic v2 configuration style for ORM/SQLAlchemy compatibility
    model_config = {"from_attributes": True}