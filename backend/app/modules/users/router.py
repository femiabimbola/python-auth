# app/modules/users/router.py
from fastapi import APIRouter, Depends,  status

from app.core.dependencies import get_current_user, get_current_active_verified_user  
from sqlalchemy.orm import Session
from app.modules.users import services 
from app.core.exceptions import NotFoundException
from app.core.database import get_db

from app.modules.users.models import User          
from app.modules.users.dependencies import require_job_seeker, require_admin
from app.modules.users.schemas import UserResponse, JobSeekerProfileResponse, JobSeekerProfileCreate   
from app.modules.users.services import create_job_seeker_profile, get_job_seeker_profile_by_user_id    



router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user: User = Depends(get_current_active_verified_user),
):
    """
    Requires valid access token + verified email.
    """
    return current_user


# Alternative: unverified users can still see basic info
@router.get("/me/status", response_model=UserResponse)
def read_user_status(
    current_user: User = Depends(get_current_user),
):
    """
    Get current user info even if unverified.
    Useful for "check your email" page or resend verification.
    """
    return current_user


@router.post("/job-seeker/profile", response_model=JobSeekerProfileResponse,
    status_code=status.HTTP_201_CREATED, summary="Create job seeker profile",
    description="Create a new job seeker profile for the authenticated user. Only available to users with JOB_SEEKER role.")
def create_job_seeker_profile(
    profile_data: JobSeekerProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_job_seeker)
):
    """
    Create a job seeker profile for the current user.
    """
    return services.create_job_seeker_profile(
        db=db,
        user_id=current_user.id,
        profile_data=profile_data
    )


@router.get("/job-seeker/profile",response_model=JobSeekerProfileResponse,
    summary="Get my job seeker profile",
    description="Retrieve the authenticated user's job seeker profile."
)
def get_my_job_seeker_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_job_seeker)
):
    """
    Get the current user's job seeker profile.
    """
    profile = services.get_job_seeker_profile_by_user_id(db=db, user_id=current_user.id)
    if not profile:
        raise NotFoundException("Job seeker profile not found")
    return profile