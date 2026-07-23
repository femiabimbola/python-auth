# app/modules/users/schemas.py
import re  # regular expression
from datetime import datetime
from typing import List, Optional, Self
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

from app.modules.users.models import UserRole
from app.core.enums import JobType, SalaryCurrency, WorkplaceType

class UserCreate(BaseModel):
    """Schema for user registration."""

    email: EmailStr
    first_name: str = Field(
        ..., min_length=1, max_length=100, description="User's first name"
    )
    last_name: str = Field(
        ..., min_length=1, max_length=100, description="User's last name"
    )
    password: str
    confirm_password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:

        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")

        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")

        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")

        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")

        if not re.search(
            r"[!@#$%^&*(),.?\":{}|<>_\-\[\]\/\\]",
            v,
        ):
            raise ValueError("Password must contain at least one special character")
        return v

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_names(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Name must be at least 2 characters long")
        return cleaned

    @model_validator(mode="after")
    def verify_password_match(self) -> "UserCreate":
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self
    
    


class UserResponse(BaseModel):
    """Safe user data — never expose hashed_password or tokens."""
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
    
    id: str
    email: str
    first_name: str
    last_name: str
    full_name: str
    role: UserRole  # Will serialize as string due to use_enum_values
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime | None = None
    
    # Computed booleans for frontend convenience
    is_job_seeker: bool
    is_employer: bool
    is_admin: bool
    is_superadmin: bool


class JobSeekerProfileBase(BaseModel):
    phone_number: Optional[str] = Field(None, max_length=30)
    country: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    headline: Optional[str] = Field(None, max_length=200)
    summary: Optional[str] = Field(None, max_length=2000)
    years_of_experience: Optional[int] = Field(None, ge=0, le=50)
    preferred_job_type: Optional[JobType] = None
    preferred_workplace_type: Optional[WorkplaceType] = None
    preferred_salary_min: Optional[int] = Field(None, ge=0)
    preferred_salary_max: Optional[int] = Field(None, ge=0)
    preferred_salary_currency: Optional[SalaryCurrency] = SalaryCurrency.NGN
    is_open_to_remote: bool = True
    is_open_to_relocation: bool = False
    resume_url: Optional[str] = None
    profile_image_url: Optional[str] = None
    is_profile_public: bool = True

    @model_validator(mode="after")
    def validate_salary_range(self) -> Self:
        if (
            self.preferred_salary_min is not None
            and self.preferred_salary_max is not None
            and self.preferred_salary_min > self.preferred_salary_max
        ):
            raise ValueError("Minimum salary cannot be greater than maximum salary")
        return self


class JobSeekerProfileCreate(JobSeekerProfileBase):
    """Schema for creating a new job seeker profile."""
    pass

class JobSeekerProfileResponse(JobSeekerProfileBase):
    """Schema for returning a job seeker profile."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Nested user info (optional, included when needed)
    user: Optional[UserResponse] = None


class JobSeekerProfileListParams(BaseModel):
    """Query parameters for listing/searching job seeker profiles."""
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    preferred_job_type: Optional[JobType] = None
    preferred_workplace_type: Optional[WorkplaceType] = None
    is_open_to_remote: Optional[bool] = None
    min_years_experience: Optional[int] = Field(None, ge=0)
    max_years_experience: Optional[int] = Field(None, ge=0)
    is_profile_public: Optional[bool] = True
    search: Optional[str] = None  # Search in headline, summary
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)


class PaginatedResponse(BaseModel):
    """Generic paginated response wrapper."""
    total: int
    page: int
    page_size: int
    total_pages: int
    items: List[JobSeekerProfileResponse]

class JobSeekerProfileUpdate(BaseModel):
    """Schema for updating an existing job seeker profile — all fields optional."""
    phone_number: Optional[str] = Field(None, max_length=30)
    country: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    headline: Optional[str] = Field(None, max_length=200)
    summary: Optional[str] = Field(None, max_length=2000)
    years_of_experience: Optional[int] = Field(None, ge=0, le=50)
    preferred_job_type: Optional[JobType] = None
    preferred_workplace_type: Optional[WorkplaceType] = None
    preferred_salary_min: Optional[int] = Field(None, ge=0)
    preferred_salary_max: Optional[int] = Field(None, ge=0)
    preferred_salary_currency: Optional[SalaryCurrency] = None
    is_open_to_remote: Optional[bool] = None
    is_open_to_relocation: Optional[bool] = None
    resume_url: Optional[str] = None
    profile_image_url: Optional[str] = None
    is_profile_public: Optional[bool] = None

class EmployerProfileBase(BaseModel):
    company_name: str = Field(..., max_length=200)
    company_slug: str = Field(..., max_length=200)
    company_description: Optional[str] = Field(None, max_length=5000)
    company_website: Optional[str] = Field(None, max_length=255)
    company_email: Optional[EmailStr] = None
    company_phone: Optional[str] = Field(None, max_length=30)
    country: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=500)
    logo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    company_size: Optional[str] = Field(None, max_length=50)
    industry: Optional[str] = Field(None, max_length=100)
    year_founded: Optional[int] = None
    is_verified: bool = False
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None


class EmployerProfileCreate(EmployerProfileBase):
    pass
