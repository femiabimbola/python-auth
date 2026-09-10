# app/main.py
from contextlib import asynccontextmanager
from sched import scheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler

from app.core.config import settings
from app.core.database import create_tables
from app.modules.auth.router import router as auth_router
from app.modules.users.router import router as users_router
from app.modules.auth.services import run_daily_cleanup


# 1. Define the Lifespan Context Manager (Modern Startup/Shutdown Handling)
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()

    # Initialize and configure the background scheduler
    scheduler = BackgroundScheduler()

    # Schedule the cleanup job to run every day at 3:00 AM
    # scheduler.add_job(run_daily_cleanup, 'cron', hour=3, minute=0)
    
    scheduler.add_job(run_daily_cleanup, 'interval', days=5)

    scheduler.start()
    yield  # The application serves requests while yielding control here
    scheduler.shutdown()
    print("[Lifecycle] Background scheduler shut down safely.")
    pass


# 2. Initialize the FastAPI Application
app = FastAPI(
    title="The Job Portal with JWT Authentication",
    description="The Job Portal Authentication API with Access & Refresh Tokens using Domain Architecture",
    version="1.0.0",
    lifespan=lifespan, 
)


# 3. Configure CORS (e.g., for Next.js frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 4. Include Domain Module Routers
app.include_router(auth_router)
app.include_router(users_router)


# 5. Global Base Endpoints
@app.get("/api/health", tags=["System Health"])
def health_check():
    return {"status": "healthy", "message": "Auth API is running"}


@app.get("/", tags=["Root"])
def root():
    return {"status": "healthy", "message": "Welcome to the Scalable Auth API Gateway"}