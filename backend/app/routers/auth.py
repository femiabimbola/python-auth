from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import User, RefreshToken
from app.schemas import (
    UserCreate,
    UserLogin,
    TokenResponse,
    RefreshRequest,
    MessageResponse,
)
from app.services.email import send_welcome_email
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Register a new user and return token pair."""
    # Check if email already exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    # Create user
    user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        full_name=user_data.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate tokens
    access_token = create_access_token(user.id)
    refresh_token_str, jti, expires_at = create_refresh_token(user.id)

    # Store refresh token in DB
    db_refresh_token = RefreshToken(
        token_jti=jti,
        user_id=user.id,
        expires_at=expires_at,
    )
    db.add(db_refresh_token)
    db.commit()

    background_tasks.add_task(send_welcome_email, user.email, user.full_name)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token_str)


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return token pair."""
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    # Generate tokens
    access_token = create_access_token(user.id)
    refresh_token_str, jti, expires_at = create_refresh_token(user.id)

    # Store refresh token in DB
    db_refresh_token = RefreshToken(
        token_jti=jti,
        user_id=user.id,
        expires_at=expires_at,
    )
    db.add(db_refresh_token)
    db.commit()

    return TokenResponse(access_token=access_token, refresh_token=refresh_token_str)


@router.post("/refresh", response_model=TokenResponse)
def refresh(request: RefreshRequest, db: Session = Depends(get_db)):
    """
    Refresh the token pair using a valid refresh token.
    Implements refresh token rotation — the old token is revoked.
    """
    # Verify the refresh token JWT
    payload = verify_token(request.refresh_token, expected_type="refresh")
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    jti = payload.get("jti")
    user_id = payload.get("sub")

    if not jti or not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    # Check if the refresh token exists and is not revoked
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token_jti == jti,
        RefreshToken.user_id == user_id,
    ).first()

    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found",
        )

    if db_token.is_revoked:
        # Possible token theft — revoke ALL tokens for this user
        db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id
        ).update({"is_revoked": True})
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token reuse detected. All sessions have been revoked.",
        )

    # Revoke the old refresh token (rotation)
    db_token.is_revoked = True

    # Generate new token pair
    new_access_token = create_access_token(user_id)
    new_refresh_str, new_jti, new_expires = create_refresh_token(user_id)

    # Store the new refresh token
    new_db_token = RefreshToken(
        token_jti=new_jti,
        user_id=user_id,
        expires_at=new_expires,
    )
    db.add(new_db_token)
    db.commit()

    return TokenResponse(access_token=new_access_token, refresh_token=new_refresh_str)


@router.post("/logout", response_model=MessageResponse)
def logout(request: RefreshRequest, db: Session = Depends(get_db)):
    """Logout by revoking the refresh token."""
    payload = verify_token(request.refresh_token, expected_type="refresh")
    if payload:
        jti = payload.get("jti")
        if jti:
            db_token = db.query(RefreshToken).filter(RefreshToken.token_jti == jti).first()
            if db_token:
                db_token.is_revoked = True
                db.commit()

    return MessageResponse(message="Successfully logged out")
