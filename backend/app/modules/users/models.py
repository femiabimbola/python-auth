# app/modules/users/models.py
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import relationship

from app.core.database import Base  # Adjusted to the new core folder
from app.core.utils import generate_uuid

class User(Base):
    """User account model."""
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship to refresh tokens (SQLAlchemy resolves this string at runtime)
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")