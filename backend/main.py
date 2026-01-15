"""
Makana Backend API - Main Application Entry Point

A practice medium for developing intentional strength through starting, stopping, and alignment.
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from config.logging import setup_logging
from api.v1 import auth

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="Makana API",
    description="A practice medium for developing intentional strength",
    version="0.1.0",
    docs_url="/docs" if settings.app_env == "development" else None,
    redoc_url="/redoc" if settings.app_env == "development" else None,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api/v1")

# Import daily check router
from api.v1 import daily_check
app.include_router(daily_check.router, prefix="/api/v1")

# Import sessions router
from api.v1 import sessions
app.include_router(sessions.router, prefix="/api/v1")

# Import reduced mode router
from api.v1 import reduced_mode
app.include_router(reduced_mode.router, prefix="/api/v1")

# Import weekly check router
from api.v1 import weekly_check
app.include_router(weekly_check.router, prefix="/api/v1")

# Import setups router
from api.v1 import setups
app.include_router(setups.router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "environment": settings.app_env,
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Makana API",
        "version": "0.1.0",
        "docs": "/docs" if settings.app_env == "development" else None,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.app_env == "development",
        log_level=settings.log_level.lower(),
    )
