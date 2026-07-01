# app/modules/users/schemas.py
import re  # regular expression
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

from app.modules.users.models import UserRole

class UserCreate(BaseModel):
    """Schema for user registration."""

    email: EmailStr
    first_name: str = Field(
        ..., min_length=1, max_length=100, description="User's first name"
    )
    last_name: str = Field(
        ..., min_length=1, max_length=100, description="User's last name"
    )
    password: str
    confirm_password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:

        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")

        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")

        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")

        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")

        if not re.search(
            r"[!@#$%^&*(),.?\":{}|<>_\-\[\]\/\\]",
            v,
        ):
            raise ValueError("Password must contain at least one special character")
        return v

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_names(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Name must be at least 2 characters long")
        return cleaned

    @model_validator(mode="after")
    def verify_password_match(self) -> "UserCreate":
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self
    
    


class UserResponse(BaseModel):
    """Safe user data — never expose hashed_password or tokens."""
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
    
    id: str
    email: str
    first_name: str
    last_name: str
    full_name: str
    role: UserRole  # Will serialize as string due to use_enum_values
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime | None = None
    
    # Computed booleans for frontend convenience
    is_job_seeker: bool
    is_employer: bool
    is_admin: bool
    is_superadmin: bool
