# app/core/config.py
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Security & JWT Settings
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database & Infrastructure Settings
    DATABASE_URL: str = "sqlite:///./auth.db"
    FRONTEND_URL: str = "http://localhost:3000"

    # Pydantic v2 Modern Configuration Management
    model_config = SettingsConfigDict(
        # Resolves down to the root directory where your .env file sits
        env_file=Path(__file__).resolve().parent.parent.parent / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True, 
    )


# Instantiate settings for global use across the application
settings = Settings()