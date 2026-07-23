# backend/app/modules/users/services.py

from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.modules.users.models import User, JobSeekerProfile
from app.modules.users import schemas
from app.core.exceptions import NotFoundException, ConflictException, ValidationException


# ==================== CRUD Operations ====================

def create_job_seeker_profile(
    db: Session,
    user_id: str,
    profile_data: schemas.JobSeekerProfileCreate
) -> JobSeekerProfile:
    """
    Create a new job seeker profile for a user.
    
    Raises:
        ConflictException: If user already has a profile.
        NotFoundException: If user does not exist or is not a job seeker.
        ValidationException: If salary range is invalid.
    """
    # Verify user exists and is a job seeker
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundException("User not found")
    
    if not user.is_job_seeker:
        raise ValidationException("User must have JOB_SEEKER role to create this profile")
    
    # Check if profile already exists
    existing = db.query(JobSeekerProfile).filter(
        JobSeekerProfile.user_id == user_id
    ).first()
    
    if existing:
        raise ConflictException("Job seeker profile already exists for this user")
    
    # Validate salary range if both provided
    if (profile_data.preferred_salary_min is not None and 
        profile_data.preferred_salary_max is not None and
        profile_data.preferred_salary_min > profile_data.preferred_salary_max):
        raise ValidationException("Minimum salary cannot be greater than maximum salary")
    
    # Create profile
    db_profile = JobSeekerProfile(
        user_id=user_id,
        **profile_data.model_dump(exclude_unset=True)
    )
    
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    
    return db_profile


def get_job_seeker_profile_by_id(
    db: Session,
    profile_id: str
) -> Optional[JobSeekerProfile]:
    """Get a job seeker profile by its ID."""
    return db.query(JobSeekerProfile).filter(
        JobSeekerProfile.id == profile_id
    ).first()


def get_job_seeker_profile_by_user_id(
    db: Session,
    user_id: str
) -> Optional[JobSeekerProfile]:
    """Get a job seeker profile by user ID."""
    return db.query(JobSeekerProfile).filter(
        JobSeekerProfile.user_id == user_id
    ).first()


def get_public_job_seeker_profile(
    db: Session,
    profile_id: str
) -> Optional[JobSeekerProfile]:
    """
    Get a public job seeker profile by ID.
    Returns None if profile doesn't exist or is private.
    """
    return db.query(JobSeekerProfile).filter(
        JobSeekerProfile.id == profile_id,
        JobSeekerProfile.is_profile_public == True
    ).first()


def update_job_seeker_profile(
    db: Session,
    user_id: str,
    profile_data: schemas.JobSeekerProfileUpdate
) -> JobSeekerProfile:
    """
    Update an existing job seeker profile.
    
    Raises:
        NotFoundException: If profile doesn't exist.
        ValidationException: If salary range is invalid.
    """
    profile = db.query(JobSeekerProfile).filter(
        JobSeekerProfile.user_id == user_id
    ).first()
    
    if not profile:
        raise NotFoundException("Job seeker profile not found")
    
    # Validate salary range if both provided
    update_data = profile_data.model_dump(exclude_unset=True)
    
    salary_min = update_data.get('preferred_salary_min', profile.preferred_salary_min)
    salary_max = update_data.get('preferred_salary_max', profile.preferred_salary_max)
    
    if (salary_min is not None and salary_max is not None and 
        salary_min > salary_max):
        raise ValidationException("Minimum salary cannot be greater than maximum salary")
    
    # Update fields
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    
    return profile


def delete_job_seeker_profile(
    db: Session,
    user_id: str
) -> None:
    """
    Delete a job seeker profile.
    
    Raises:
        NotFoundException: If profile doesn't exist.
    """
    profile = db.query(JobSeekerProfile).filter(
        JobSeekerProfile.user_id == user_id
    ).first()
    
    if not profile:
        raise NotFoundException("Job seeker profile not found")
    
    db.delete(profile)
    db.commit()


# ==================== Listing & Search ====================

def list_job_seeker_profiles(
    db: Session,
    params: schemas.JobSeekerProfileListParams,
    include_private: bool = False
) -> schemas.PaginatedResponse:
    """
    List job seeker profiles with filtering and pagination.
    
    Args:
        db: Database session
        params: Filter and pagination parameters
        include_private: If True, includes private profiles (admin only)
    """
    query = db.query(JobSeekerProfile)
    
    # Only show public profiles unless admin
    if not include_private:
        query = query.filter(JobSeekerProfile.is_profile_public == True)
    
    # Apply filters
    if params.country:
        query = query.filter(
            func.lower(JobSeekerProfile.country) == params.country.lower()
        )
    
    if params.state:
        query = query.filter(
            func.lower(JobSeekerProfile.state) == params.state.lower()
        )
    
    if params.city:
        query = query.filter(
            func.lower(JobSeekerProfile.city) == params.city.lower()
        )
    
    if params.preferred_job_type:
        query = query.filter(
            JobSeekerProfile.preferred_job_type == params.preferred_job_type
        )
    
    if params.preferred_workplace_type:
        query = query.filter(
            JobSeekerProfile.preferred_workplace_type == params.preferred_workplace_type
        )
    
    if params.is_open_to_remote is not None:
        query = query.filter(
            JobSeekerProfile.is_open_to_remote == params.is_open_to_remote
        )
    
    if params.min_years_experience is not None:
        query = query.filter(
            JobSeekerProfile.years_of_experience >= params.min_years_experience
        )
    
    if params.max_years_experience is not None:
        query = query.filter(
            JobSeekerProfile.years_of_experience <= params.max_years_experience
        )
    
    # Text search in headline and summary
    if params.search:
        search_term = f"%{params.search}%"
        query = query.filter(
            or_(
                JobSeekerProfile.headline.ilike(search_term),
                JobSeekerProfile.summary.ilike(search_term)
            )
        )
    
    # Get total count
    total = query.count()
    
    # Pagination
    offset = (params.page - 1) * params.page_size
    items = query.offset(offset).limit(params.page_size).all()
    
    total_pages = (total + params.page_size - 1) // params.page_size
    
    return schemas.PaginatedResponse(
        total=total,
        page=params.page,
        page_size=params.page_size,
        total_pages=total_pages,
        items=items
    )


# ==================== Utility Functions ====================

def job_seeker_profile_exists(
    db: Session,
    user_id: str
) -> bool:
    """Check if a user already has a job seeker profile."""
    return db.query(JobSeekerProfile).filter(
        JobSeekerProfile.user_id == user_id
    ).first() is not None


def toggle_job_seeker_profile_visibility(
    db: Session,
    user_id: str
) -> JobSeekerProfile:
    """Toggle the public/private status of a profile."""
    profile = get_job_seeker_profile_by_user_id(db, user_id)
    if not profile:
        raise NotFoundException("Job seeker profile not found")
    
    profile.is_profile_public = not profile.is_profile_public
    db.commit()
    db.refresh(profile)
    
    return profile