# app/core/security.py
import uuid
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt

from app.core.config import settings


# =========================================================================
# PASSWORD CRYPTOGRAPHY (Using modern, native bcrypt wrapper)
# =========================================================================

def hash_password(password: str) -> str:
    """Hash a plain text password using bcrypt."""
    # bcrypt requires bytes, so we encode strings before hashing
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against an existing hash."""
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), 
        hashed_password.encode("utf-8")
    )


# =========================================================================
# TOKEN SECURITY (JWT Management)
# =========================================================================

def create_access_token(user_id: str) -> str:
    """Create a short-lived access token."""
    now = datetime.now(timezone.utc)
    expires = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    payload = {
        "sub": str(user_id),
        "token_type": "access",
        "exp": int(expires.timestamp()),  # PyJWT standard expects integer timestamps
        "iat": int(now.timestamp()),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(user_id: str) -> tuple[str, str, datetime]:
    """
    Create a long-lived refresh token with a unique JTI.
    Returns: (token_string, jti, expires_at_datetime)
    """
    now = datetime.now(timezone.utc)
    jti = str(uuid.uuid4())
    expires = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    payload = {
        "sub": str(user_id),
        "token_type": "refresh",
        "exp": int(expires.timestamp()),
        "iat": int(now.timestamp()),
        "jti": jti,
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token, jti, expires


def verify_token(token: str, expected_type: str = "access") -> dict | None:
    """
    Decode and verify a JWT token.
    Returns the payload dict if valid, None otherwise.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_type = payload.get("token_type")
        if token_type != expected_type:
            return None
        return payload
    except jwt.PyJWTError:
        return None