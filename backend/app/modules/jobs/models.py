# app/modules/jobs/models.py

from sqlalchemy import JSON, CheckConstraint, Column, String, Integer, Boolean, DateTime, Text, func, Enum, ForeignKey, Table, Index, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.core.utils import generate_uuid


# ─── Enums ──────────────────────────────────────────────────────────

from app.core.enums import (
    JobType,
    ExperienceLevel,
    JobStatus,
    WorkplaceType,
    SalaryCurrency,
    ApplicationStatus
)

# ─── Association Tables ─────────────────────────────────────────────

job_skills = Table(
    "job_skills",
    Base.metadata,
    Column("job_id", String, ForeignKey("jobs.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", String, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)

# ─── Models ───────────────────────────────────────────────────────

class Skill(Base):
    """Normalized skill taxonomy."""
    __tablename__ = "skills"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(100), unique=True, nullable=False, index=True)  # "Python", "Project Management"
    category = Column(String(100), nullable=True)  # "Programming", "Soft Skills", "Design"
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    jobs = relationship("Job", secondary=job_skills, back_populates="skills")
    job_seeker_associations = relationship( "JobSeekerSkill", back_populates="skill", 
        cascade="all, delete-orphan"
    )


class Job(Base):
    """Job posting by employers."""
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=generate_uuid)
    employer_profile_id = Column(
        String, 
        ForeignKey("employer_profiles.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    # ── Job Content ──────────────────────────────────────────────
    title = Column(String(200), nullable=False, index=True)
    slug = Column(String(250), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)           # Full job description
    responsibilities = Column(Text, nullable=True)       # What they'll do
    requirements = Column(Text, nullable=False)           # Must-haves
    nice_to_have = Column(Text, nullable=True)            # Bonus skills
    
    # ── Job Metadata ─────────────────────────────────────────────
    job_type = Column(Enum(JobType), nullable=False, default=JobType.FULL_TIME)
    experience_level = Column(Enum(ExperienceLevel), nullable=False, default=ExperienceLevel.ENTRY)
    
    # ── Location (Nigeria-specific) ────────────────────────────
    workplace_type = Column(Enum(WorkplaceType), default=WorkplaceType.ONSITE) # onsite, remote, hybrid
    country = Column(String(100), nullable=True, default="Nigeria")
    state = Column(String(100), nullable=True, index=True)    # Lagos, Kano, FCT, Rivers, etc.
    city = Column(String(100), nullable=True)                  # Ikeja, Port Harcourt, etc.
    lga = Column(String(100), nullable=True)                  # Local Government Area
    
    # ── Salary ─────────────────────────────────────────────────
    salary_min = Column(Integer, nullable=True)              # in lowest denomination (kobo)
    salary_max = Column(Integer, nullable=True)
    salary_currency = Column(Enum(SalaryCurrency), default=SalaryCurrency.NGN)
    is_salary_visible = Column(Boolean, default=True)        # Some employers hide salary
    
    # ── Status & Timing ────────────────────────────────────────
    status = Column(Enum(JobStatus), nullable=False, default=JobStatus.DRAFT)
    expires_at = Column(DateTime(timezone=True), nullable=True)  # Auto-close after this
    published_at = Column(DateTime(timezone=True), nullable=True)  # When it went live
    closed_at = Column(DateTime(timezone=True), nullable=True)
    
    # ── Visibility & Promotion ───────────────────────────────
    is_featured = Column(Boolean, default=False)             # Paid promotion
    is_urgent = Column(Boolean, default=False)               # Urgent hiring badge
    
    # ── Application Settings ─────────────────────────────────
    application_url = Column(String, nullable=True)            # External apply link (optional)
    application_email = Column(String, nullable=True)          # Where to send applications
    max_applications = Column(Integer, nullable=True)        # Cap applications (null = unlimited)
    requires_cover_letter = Column(Boolean, default=False)
    custom_questions = Column(JSON, nullable=True)         # JSON array of questions
    
    # ── Counters ───────────────────────────────────────────────
    view_count = Column(Integer, default=0)
    application_count = Column(Integer, default=0)
    
    # ── Timestamps ─────────────────────────────────────────────
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # ── Relationships ──────────────────────────────────────────
    employer_profile = relationship("EmployerProfile", back_populates="jobs")
    skills = relationship("Skill", secondary=job_skills, back_populates="jobs")
    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")
   
    
    # Indexes for common queries
    __table_args__ = (
        # Composite: active jobs in a state
        Index("idx_jobs_status_state", "status", "state"),
        # Composite: featured active jobs
        Index("idx_jobs_featured_active", "is_featured", "status"),
        # Composite: job type + experience for filtering
        Index("idx_jobs_type_experience", "job_type", "experience_level"),
        Index("idx_jobs_state_lga", "state", "lga"),
        CheckConstraint(
        "salary_max IS NULL OR salary_min IS NULL OR salary_max >= salary_min",
        name="chk_job_salary_range"
        ),
        CheckConstraint(
        "max_applications IS NULL OR max_applications >= 1",
        name="chk_job_max_applications"
        ),
        CheckConstraint(
        "expires_at IS NULL OR published_at IS NULL OR expires_at > published_at",
        name="chk_job_expiry_after_publish"
        ),
    )


class JobApplication(Base):
    """Job seeker application to a job."""
    __tablename__ = "job_applications"

    id = Column(String, primary_key=True, default=generate_uuid)
    job_id = Column(
        String, 
        ForeignKey("jobs.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    job_seeker_profile_id = Column(
        String, 
        ForeignKey("job_seeker_profiles.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    # ── Application Content ────────────────────────────────────
    resume_url = Column(String, nullable=True)               # Specific resume for this application
    cover_letter = Column(Text, nullable=True)
    answers = Column(JSON, nullable=True)                  # JSON answers to custom questions
    
    # ── Status Tracking ────────────────────────────────────────
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING)
    
    # ── Employer Actions ───────────────────────────────────────
    viewed_at = Column(DateTime(timezone=True), nullable=True)
    shortlisted_at = Column(DateTime(timezone=True), nullable=True)
    rejected_at = Column(DateTime(timezone=True), nullable=True)
    rejection_reason = Column(String(500), nullable=True)
    hired_at = Column(DateTime(timezone=True), nullable=True)
    
    # ── Timestamps ─────────────────────────────────────────────
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # ── Relationships ──────────────────────────────────────────
    job = relationship("Job", back_populates="applications")
    job_seeker_profile = relationship("JobSeekerProfile", back_populates="applications")
    
    # Prevent duplicate applications
    __table_args__ = (
        UniqueConstraint("job_id", "job_seeker_profile_id", name="uq_one_application_per_job"),
    )


class WorkExperience(Base):
    """Job seeker's work history."""
    __tablename__ = "work_experiences"

    id = Column(String, primary_key=True, default=generate_uuid)
    job_seeker_profile_id = Column(
        String, 
        ForeignKey("job_seeker_profiles.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    company_name = Column(String(200), nullable=False)
    job_title = Column(String(200), nullable=False)
    location = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    
    is_current = Column(Boolean, default=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    job_seeker_profile = relationship("JobSeekerProfile", back_populates="experiences")

    __table_args__ = ( 
    CheckConstraint(
    "(is_current = TRUE AND end_date IS NULL) OR (is_current = FALSE AND end_date IS NOT NULL AND end_date >= start_date)",
    name="chk_work_experience_current_logic"
      ),
    )
    


class Education(Base):
    """Job seeker's education history."""
    __tablename__ = "educations"

    id = Column(String, primary_key=True, default=generate_uuid)
    job_seeker_profile_id = Column(
        String, 
        ForeignKey("job_seeker_profiles.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    institution = Column(String(200), nullable=False)
    degree = Column(String(200), nullable=False)           # "B.Sc", "M.Sc", "HND", "OND"
    field_of_study = Column(String(200), nullable=True)  # "Computer Science"
    grade = Column(String(50), nullable=True)              # "First Class", "2:1", "Upper Credit"
    
    is_current = Column(Boolean, default=False)
    start_year = Column(Integer, nullable=False)
    end_year = Column(Integer, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    job_seeker_profile = relationship("JobSeekerProfile", back_populates="educations")

    __table_args__ = (
        CheckConstraint(
            "end_year IS NULL OR end_year >= start_year",  name="chk_education_years"
        ),
    )


class JobSeekerSkill(Base):
    """Job seeker's skills with proficiency level."""
    __tablename__ = "job_seeker_skills"

    id = Column(String, primary_key=True, default=generate_uuid)
    job_seeker_profile_id = Column(
        String, 
        ForeignKey("job_seeker_profiles.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    skill_id = Column(
        String, 
        ForeignKey("skills.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    proficiency_level = Column(Integer, nullable=True)  # 1-5 scale
    years_of_experience = Column(Integer, nullable=True)
    
    job_seeker_profile = relationship("JobSeekerProfile", back_populates="skills")
    skill = relationship("Skill", back_populates="job_seeker_associations")
    __table_args__ = (
        UniqueConstraint( "job_seeker_profile_id", "skill_id",
            name="uq_job_seeker_skill"
        ),
        CheckConstraint(
        "proficiency_level IS NULL OR (proficiency_level >= 1 AND proficiency_level <= 5)",
        name="chk_skill_proficiency_range"
        ),
        CheckConstraint(
        "years_of_experience IS NULL OR years_of_experience >= 0",
        name="chk_skill_years_non_negative"
        ),
    )