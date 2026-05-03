from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import create_tables
from app.routers import auth, users

# 1. Define the Lifespan Context Manager==
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Actions on Startup:
    create_tables()
    yield  # The application serves requests while here
    # e.g., await database.disconnect()
    pass

# 2. Initialize the FastAPI Application
app = FastAPI(
    title="Auth API",
    description="JWT Authentication API with Access & Refresh Tokens",
    version="1.0.0",
    lifespan=lifespan, # Linking the lifespan manager here
)

# 3. Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Include Routers
app.include_router(auth.router)
app.include_router(users.router)

# 5. Global Endpoints
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "Auth API is running"}

# 5. Global Endpoints
@app.get("/")
def root():
    return {"status": "healthy", "message": "Auth API is running N"}