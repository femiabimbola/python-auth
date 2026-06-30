import enum

class SalaryCurrency(str, enum.Enum):
    NGN = "NGN"   # Nigerian Naira (default)
    USD = "USD"   # For remote international roles

class UserRole(str, enum.Enum):
    """User roles in the platform."""
    JOB_SEEKER = "job_seeker"
    EMPLOYER = "employer"
    ADMIN = "admin"
    SUPERADMIN = "superadmin"

class JobType(str, enum.Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"

class WorkplaceType(str, enum.Enum):
    ONSITE = "onsite"
    REMOTE = "remote"
    HYBRID = "hybrid"



class ExperienceLevel(str, enum.Enum):
    ENTRY = "entry"           # 0-2 years
    MID = "mid"               # 2-5 years
    SENIOR = "senior"         # 5-10 years
    EXECUTIVE = "executive"   # 10+ years

class JobStatus(str, enum.Enum):
    DRAFT = "draft"           # Employer still editing
    PENDING = "pending"       # Submitted, awaiting admin/moderation review
    ACTIVE = "active"         # Live, visible to job seekers
    PAUSED = "paused"         # Temporarily hidden by employer
    CLOSED = "closed"         # Employer manually closed
    EXPIRED = "expired"       # Past deadline, auto-closed
    REJECTED = "rejected"     # Failed moderation (scam, inappropriate)


class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"       # Submitted, not yet viewed
    VIEWED = "viewed"         # Employer opened it
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    HIRED = "hired"
