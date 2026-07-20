# app/modules/auth/router.py
import logging
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.schemas import UserLogin, TokenResponse, RefreshRequest, MessageResponse, RegistrationResponse, EmailRequestSchema, PasswordResetRequest, PasswordResetVerify
from app.modules.users.schemas import UserCreate
from app.modules.auth import services  # Bring in our feature services
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, background_tasks: BackgroundTasks, request: Request, db: Session = Depends(get_db)):
    """Register a new user and return token pair."""

    # Extract client metadata for observability/logs
    ip_address = request.client.host if request.client else "Unknown"
    user_agent = request.headers.get("user-agent", "Unknown")

    try:
        return services.register_user_workflow(
            db=db, user_data=user_data, background_tasks=background_tasks,
            ip_address=ip_address, user_agent=user_agent
        )
    except HTTPException as http_exc:
        # we roll back the session one last time at the router boundary to clear any poisoned state,
        # then re-raise it so FastAPI safely bypasses structural database teardowns.
        raise http_exc
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while finalizing the request context."
        )
    

@router.get("/verify-email", status_code=status.HTTP_200_OK)
def verify_email(token: str =  Query(..., description="Email Verification token"),db: Session = Depends(get_db)):
    """Endpoint to process the email verification link clicked by the user."""
    return services.verify_user_email_workflow(db=db, token=token)


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return token pair."""
    access_token, refresh_token = services.authenticate_user_workflow(db, credentials)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
def refresh(request: RefreshRequest, db: Session = Depends(get_db)):
    """Refresh token pairs using valid, rotated refresh tokens."""
    access_token, refresh_token, has_profile = services.rotate_refresh_token_workflow(db, request)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token, has_profile=has_profile)


@router.post("/logout", response_model=MessageResponse)
def logout(request: RefreshRequest, db: Session = Depends(get_db)):
    """Logout by revoking active refresh session strings."""
    services.revoke_session_workflow(db, request)
    return MessageResponse(message="Successfully logged out")

@router.post( "/resend-verification", status_code=status.HTTP_200_OK, summary="Resend verification email")
def resend_verification( payload: EmailRequestSchema, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Resend email if not received before OK to prevent email enumeration."""
    services.resend_verification_workflow(
        db=db, email_schema=payload, 
        background_tasks=background_tasks
    )
    return {"detail": "If the email is registered and unverified, a new link has been sent."}


@router.post("/password-reset/request", status_code=status.HTTP_200_OK)
def request_password_reset(payload: PasswordResetRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)
):
    try:
        return services.request_password_reset_workflow(db, payload.email, background_tasks)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to process password reset request.",
        )
    

@router.post("/password-reset/verify", status_code=status.HTTP_200_OK)
def verify_reset_token_endpoint(payload: PasswordResetVerify, db: Session = Depends(get_db)
):
    """
    Verify token is valid AND change password in one step.
    Returns 200 with generic message even on failure (security through obscurity).
    """
    try:
        result = services.change_password_workflow(db, payload.token, payload.new_password)
        return result

    except ValueError as e:
        # Token invalid/expired - still return 200 to prevent email enumeration
        logger.warning(f"Password reset failed: {e}")
        return {"message": "If the token is valid, your password has been reset."}

    except Exception:
        logger.exception("Password reset failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to process password reset."
        )