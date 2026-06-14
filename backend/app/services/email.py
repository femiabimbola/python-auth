from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME = settings.MAIL_USERNAME,
    MAIL_PASSWORD = settings.MAIL_PASSWORD,
    MAIL_FROM = settings.MAIL_FROM,
    MAIL_PORT = settings.MAIL_PORT,
    MAIL_SERVER = settings.MAIL_SERVER,
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True
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


async def send_verification_email(email: str, full_name: str, verification_token: str):
    """
    Sends a verification email containing the unique registration token.
    """
    # Replace this link with your actual frontend verification route later
    verification_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
    
    body_content = (
        f"Hello {full_name},\n\n"
        f"Thank you for registering! Please verify your email address by clicking the link below:\n"
        f"{verification_link}\n\n"
        f"This link will expire in 24 hours.\n\n"
        f"If you did not create this account, please ignore this email."
    )

    message = MessageSchema(
        subject="Verify Your Email Address",
        recipients=[email],
        body=body_content,
        subtype=MessageType.plain
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)