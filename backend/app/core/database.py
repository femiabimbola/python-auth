# app/core/database.py
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings

# 1. Initialize the engine using centralized configuration settings
engine = create_engine(settings.DATABASE_URL)

# 2. Setup the session factory for handling transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# 3. Modern SQLAlchemy 2.0 Declarative Base (Provides native IDE type-hinting)
class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


# =========================================================================
# DOMAIN MODEL REGISTRATION (Crucial for the Scalable Folder Structure)
# =========================================================================
# We explicitly import the split models here. This registers them into 
# Base.metadata so that `create_tables()` or Alembic migrations can detect them.
from app.modules.users.models import User
from app.modules.auth.models import RefreshToken

# When you add new feature modules (e.g., app.modules.products), import their models below:
# from app.modules.products.models import Product
# =========================================================================


def create_tables() -> None:
    """Create all database tables based on registered models."""
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator:
    """
    FastAPI dependency that yields a transactional database session.
    Automatically closes the session after the HTTP request lifecycle completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()