# app/core/database.py
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.event import listens_for  # <-- Added for event tracking

from app.core.config import settings

# 1. Initialize the engine using centralized configuration settings
engine = create_engine(settings.DATABASE_URL)


# ─── Global Database Timezone Fix ───────────────────────────────────
@listens_for(engine, "connect")
def set_webapp_timezone(dbapi_connection, connection_record):
    """
    Forces every database connection session to operate strictly in UTC.
    This ensures that func.now() universally saves and reads UTC timestamps.
    """
    cursor = dbapi_connection.cursor()
    try:
        # Works seamlessly for PostgreSQL
        cursor.execute("SET TIME ZONE 'UTC';")
    except Exception:
        # Fallback safeguard if using SQLite for local unit testing
        pass
    finally:
        cursor.close()
# ─────────────────────────────────────────────────────────────────────


# 2. Setup the session factory for handling transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# 3. Modern SQLAlchemy 2.0 Declarative Base (Provides native IDE type-hinting)
class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


# We explicitly import the split models here. This registers them into 
# Base.metadata so that `create_tables()` or Alembic migrations can detect them.
from app.modules.users.models import User, JobSeekerProfile, EmployerProfile
from app.modules.auth.models import RefreshToken, EmailVerificationToken, PasswordResetToken
from app.modules.jobs.models import ( Job, JobApplication, Skill, WorkExperience, Education, JobSeekerSkill )

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