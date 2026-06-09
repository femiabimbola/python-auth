# app/modules/auth/schemas.py
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator, Field


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower().strip()

class RegistrationResponse(BaseModel):
    """Schema for Registration response."""
    message: str
    requires_verification: bool

class TokenResponse(BaseModel):
    """Schema for token pair response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Schema for decoded JWT payload."""
    sub: str
    token_type: str
    exp: datetime
    jti: str | None = None


class RefreshRequest(BaseModel):
    """Schema for refresh token request."""
    refresh_token: str


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str


class EmailRequestSchema(BaseModel):
    """Schema to validate an incoming email address for resending verification."""
    email: EmailStr = Field(..., description="The user's registered email address")
