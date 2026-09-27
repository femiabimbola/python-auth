from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    APP_BASE_URL: str = "http://localhost:8000"

    # Security & JWT Settings
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database & Infrastructure Settings
    DATABASE_URL: str = "sqlite:///./auth.db"
    FRONTEND_URL: str = "http://localhost:3000"

    # --- MAIL SETTINGS ---
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@yourdomain.com"
    MAIL_FROM_ADDRESS: str = "noreply@yourdomain.com"
    MAIL_FROM_NAME: str = "Demo"
    MAIL_PORT: int = 1025                 # Default to Mailpit port for local dev
    MAIL_SERVER: str = "127.0.0.1"        # Default to Mailpit server
    MAIL_STARTTLS: bool = False           # Set to False for Mailpit
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = False         # Add this

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent.parent.parent / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True, 
    )

settings = Settings()