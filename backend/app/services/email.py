# backend/app/services/email.py

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME = settings.MAIL_USERNAME,
    MAIL_PASSWORD = settings.MAIL_PASSWORD,
    MAIL_FROM = settings.MAIL_FROM,
    MAIL_PORT = settings.MAIL_PORT,
    MAIL_SERVER = settings.MAIL_SERVER,
    MAIL_STARTTLS = settings.MAIL_STARTTLS,       # Now dynamic
    MAIL_SSL_TLS = settings.MAIL_SSL_TLS,         # Now dynamic
    USE_CREDENTIALS = settings.USE_CREDENTIALS    # Now dynamic
)

async def send_welcome_email(email: str, name: str):
    message = MessageSchema(
        subject="Welcome!",
        recipients=[email],
        body=f"Hello {name}, welcome aboard!",
        subtype=MessageType.plain
    )
    fm = FastMail(conf)
    await fm.send_message(message)

async def send_verification_email(email: str, full_name: str, verification_code: str):
    """
    Sends a verification email containing the 6-digit registration code.
    """
    
    body_content = (
        f"Hello {full_name},\n\n"
        f"Thank you for registering! Please verify your email address by entering the 6-digit code below on the verification page:\n\n"
        f"Code: {verification_code}\n\n"
        f"This code will expire in 15 minutes.\n\n"
        f"If you did not create this account, please ignore this email."
    )

    message = MessageSchema(
        subject="Your 6-Digit Verification Code",
        recipients=[email],
        body=body_content,
        subtype=MessageType.plain  # Or MessageType.html if you decide to use HTML formatting later
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)


async def send_password_reset_email(email: str, full_name: str, reset_token: str):
    """
    Sends a password reset email containing the unique reset token.
    """
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    
    body_content = (
        f"Hello {full_name},\n\n"
        f"We received a request to reset the password for your account.\n\n"
        f"Click the link below to reset your password:\n"
        f"{reset_link}\n\n"
        f"This link will expire in 30 minutes.\n\n"
        f"If you did not request a password reset, please ignore this email — your password will remain unchanged."
    )

    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email],
        body=body_content,
        subtype=MessageType.plain
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)