# app/modules/auth/router.py
from fastapi import APIRouter, Depends, status, Query, Request, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.schemas import UserLogin, TokenResponse, RefreshRequest, MessageResponse, RegistrationResponse
from app.modules.users.schemas import UserCreate
from app.modules.auth import services  # Bring in our feature services

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, background_tasks: BackgroundTasks, request: Request,db: Session = Depends(get_db)):
    """Register a new user and return token pair."""

    # Extract client metadata for observability/logs
    ip_address = request.client.host if request.client else "Unknown"
    user_agent = request.headers.get("user-agent", "Unknown")

    return services.register_user_workflow(
        db=db, user_data=user_data, background_tasks=background_tasks,
        ip_address=ip_address, user_agent=user_agent
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
    access_token, refresh_token = services.rotate_refresh_token_workflow(db, request)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/logout", response_model=MessageResponse)
def logout(request: RefreshRequest, db: Session = Depends(get_db)):
    """Logout by revoking active refresh session strings."""
    services.revoke_session_workflow(db, request)
    return MessageResponse(message="Successfully logged out")