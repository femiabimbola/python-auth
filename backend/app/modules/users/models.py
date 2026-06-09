# app/modules/users/models.py
from sqlalchemy import Column, String, Integer, Boolean, DateTime, func, ForeignKey
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
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to refresh tokens (SQLAlchemy resolves this string at runtime)
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    user_profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    

class UserProfile(Base):
    """User profile model for storing optional/extended demographics."""
    __tablename__ = "user_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(
        String,  ForeignKey("users.id", ondelete="CASCADE"), 
        unique=True, nullable=False,index=True
    )
    country = Column(String(100), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)
    image_url = Column(String, nullable=True)
    phone_number = Column(String(30), nullable=True)  # String to handle country codes like '+1' or '+234'

    # Bidirectional relationship back to the User model
    user = relationship("User", back_populates="user_profile")