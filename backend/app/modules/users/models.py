# app/modules/users/models.py

from sqlalchemy import Column, String, Integer, Boolean, DateTime, func, Enum, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.core.utils import generate_uuid

from app.core.enums import UserRole, JobType, WorkplaceType, SalaryCurrency

class User(Base):
    """Core user account — authentication only."""
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Role-based access
    role = Column(Enum(UserRole), nullable=False, default=UserRole.JOB_SEEKER)
    
    # Account status
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Auth relationships
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    password_reset_tokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")
    email_verification_tokens= relationship("EmailVerificationToken", back_populates="user", cascade="all, delete-orphan")
    
    # Role-specific profiles (one-to-one, only one populated based on role)
    job_seeker_profile = relationship("JobSeekerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    employer_profile = relationship("EmployerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_job_seeker(self):
        return self.role == UserRole.JOB_SEEKER
    
    @property
    def is_employer(self):
        return self.role == UserRole.EMPLOYER
    
    @property
    def is_admin(self):
        return self.role == UserRole.ADMIN
    
    @property
    def is_superadmin(self):
        return self.role == UserRole.SUPERADMIN



class JobSeekerProfile(Base):
    """Extended profile for job seekers."""
    __tablename__ = "job_seeker_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(
        String, 
        ForeignKey("users.id", ondelete="CASCADE"), 
        unique=True, 
        nullable=False,
        index=True
    )
    
    # Contact & identity
    phone_number = Column(String(30), nullable=True, index=True)  # +2348012345678
    country = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)  # Lagos, Kano, FCT, etc.
    city = Column(String(100), nullable=True)   # Ikeja, Wuse, etc.
    
    # Professional info
    headline = Column(String(200), nullable=True)  # "Senior Python Developer"
    summary = Column(String(2000), nullable=True)    # Bio / about me
    years_of_experience = Column(Integer, nullable=True)
    
    # Work preferences
    preferred_job_type = Column(Enum(JobType), nullable=True)
    preferred_workplace_type = Column(Enum(WorkplaceType), nullable=True)  # City,
    preferred_salary_min = Column(Integer, nullable=True)         # in Kobo
    preferred_salary_max = Column(Integer, nullable=True)
    preferred_salary_currency = Column(Enum(SalaryCurrency), default=SalaryCurrency.NGN, nullable=True)
    is_open_to_remote = Column(Boolean, default=True)
    is_open_to_relocation = Column(Boolean, default=False)
    
    # Profile media
    resume_url = Column(String, nullable=True)       # S3/Cloudflare link
    profile_image_url = Column(String, nullable=True)
    
    # Visibility
    is_profile_public = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="job_seeker_profile")
    
    # Relationships
    skills = relationship("JobSeekerSkill", back_populates="job_seeker_profile", cascade="all, delete-orphan")
    experiences = relationship("WorkExperience", back_populates="job_seeker_profile", cascade="all, delete-orphan")
    educations = relationship("Education", back_populates="job_seeker_profile", cascade="all, delete-orphan")
    applications = relationship("JobApplication", back_populates="job_seeker_profile")


class EmployerProfile(Base):
    """Extended profile for employers / companies."""
    __tablename__ = "employer_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(
        String, 
        ForeignKey("users.id", ondelete="CASCADE"), 
        unique=True, 
        nullable=False,
        index=True
    )
    
    # Company info
    company_name = Column(String(200), nullable=False)
    company_slug = Column(String(200), unique=True, nullable=False, index=True)  # URL-friendly
    company_description = Column(String(5000), nullable=True)
    company_website = Column(String(255), nullable=True)
    company_email = Column(String(255), nullable=True)
    company_phone = Column(String(30), nullable=True)
    
    # Location
    country = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    address = Column(String(500), nullable=True)
    
    # Company branding
    logo_url = Column(String, nullable=True)
    cover_image_url = Column(String, nullable=True)
    
    # Company metadata
    company_size = Column(String(50), nullable=True)   # "1-10", "11-50", "51-200", etc.
    industry = Column(String(100), nullable=True)        # "Technology", "Finance", etc.
    year_founded = Column(Integer, nullable=True)
    
    # Verification
    is_verified = Column(Boolean, default=False)  # Admin-verified company
    verification_document_url = Column(String, nullable=True)  # CAC certificate, etc.
    
    # Social links
    linkedin_url = Column(String, nullable=True)
    twitter_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="employer_profile")
    
    # Relationships
    jobs = relationship("Job", back_populates="employer_profile", cascade="all, delete-orphan")