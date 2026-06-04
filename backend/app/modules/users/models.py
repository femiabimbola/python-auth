# app/modules/users/models.py
from sqlalchemy import Column, String, Boolean, DateTime,func
from sqlalchemy.orm import relationship

from app.core.database import Base  # Adjusted to the new core folder
from app.core.utils import generate_uuid

class User(Base):
    """User account model."""
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column( String(100),nullable=False)
    hashed_password = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to refresh tokens (SQLAlchemy resolves this string at runtime)
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")