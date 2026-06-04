# app/modules/users/schemas.py
import re  # regular expression
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


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
    """Schema for user data in responses."""

    id: str
    email: EmailStr
    full_name: str
    is_active: bool
    created_at: datetime

    # Pydantic v2 configuration style for ORM/SQLAlchemy compatibility
    model_config = {"from_attributes": True}
