# app/modules/auth/models.py
from datetime import datetime, timezone
from sqlalchemy import Column, Integer,String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.core.utils import generate_uuid

class RefreshToken(Base):
    """Tracks issued refresh tokens for rotation and revocation."""
    __tablename__ = "refresh_tokens"

    id = Column(String, primary_key=True, default=generate_uuid)
    token_jti = Column(String(255), unique=True, index=True, nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), index=True, nullable=False)
    user_agent = Column(String(500))
    ip_address = Column(String(100))
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship back to user
    user = relationship("User", back_populates="refresh_tokens")

    def is_expired(self) -> bool:
        return datetime.now(timezone.utc) > self.expires_at
    
    def is_valid(self) -> bool:
        return not self.is_expired() and not self.is_revoked
    


class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
     # Relationship back to user
    user = relationship("User", back_populates="email_verification_tokens")

    def is_expired(self) -> bool:
        return datetime.now(timezone.utc) > self.expires_at

    def is_used(self) -> bool:
        return self.used_at is not None

    def is_valid(self) -> bool:
        return not self.is_expired() and not self.is_used()


class PasswordResetToken(Base):
    """Password reset token model for secure password recovery."""
    __tablename__ = "password_reset_tokens"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship back to user
    user = relationship("User", back_populates="password_reset_tokens")

    def is_expired(self) -> bool:
        """Check if the token has expired."""
        return datetime.now(timezone.utc) > self.expires_at

    def is_used(self) -> bool:
        """Check if the token has already been used."""
        return self.used_at is not None

    def is_valid(self) -> bool:
        """Check if the token is still valid (not expired and not used)."""
        return not self.is_expired() and not self.is_used()

