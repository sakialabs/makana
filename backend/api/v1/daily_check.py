"""
Daily Check API endpoints.

Handles daily check-in creation and history retrieval.
"""
import logging
from datetime import date
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from models.user import User
from models.daily_check import DailyCheckCreate, DailyCheckResponse
from services.daily_check_service import daily_check_service
from dependencies.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/daily-check", tags=["daily-check"])


@router.post("", response_model=DailyCheckResponse, status_code=status.HTTP_201_CREATED)
async def create_daily_check(
    check_data: DailyCheckCreate,
    current_user: User = Depends(get_current_user)
) -> DailyCheckResponse:
    """
    Create daily check-in.
    
    Args:
        check_data: Check-in responses
        current_user: Authenticated user
        
    Returns:
        Created daily check
        
    Raises:
        HTTPException: 409 if check already exists for today
    """
    try:
        check = daily_check_service.create_daily_check(
            user_id=str(current_user.id),
            check_data=check_data
        )
        
        logger.info(f"Daily check created for user: {current_user.id}")
        
        return DailyCheckResponse(
            id=check.id,
            check_date=check.check_date,
            responses=check.responses,
            completed_at=check.completed_at
        )
        
    except Exception as e:
        error_msg = str(e)
        if "already completed" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Already completed today."
            )
        
        logger.error(f"Failed to create daily check: {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to create check. Try again in a moment."
        )


@router.get("/today", response_model=DailyCheckResponse)
async def get_today_check(
    current_user: User = Depends(get_current_user)
) -> DailyCheckResponse:
    """
    Get today's check if exists.
    
    Args:
        current_user: Authenticated user
        
    Returns:
        Today's daily check
        
    Raises:
        HTTPException: 404 if no check exists for today
    """
    today = date.today()
    check = daily_check_service.get_today_check(
        user_id=str(current_user.id),
        check_date=today
    )
    
    if not check:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No check for today."
        )
    
    return DailyCheckResponse(
        id=check.id,
        check_date=check.check_date,
        responses=check.responses,
        completed_at=check.completed_at
    )


@router.get("/history", response_model=List[DailyCheckResponse])
async def get_check_history(
    limit: int = Query(30, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user)
) -> List[DailyCheckResponse]:
    """
    Get past checks with pagination.
    
    Args:
        limit: Maximum number of checks to return (1-100)
        offset: Number of checks to skip
        current_user: Authenticated user
        
    Returns:
        List of daily checks in reverse chronological order
    """
    checks = daily_check_service.get_check_history(
        user_id=str(current_user.id),
        limit=limit,
        offset=offset
    )
    
    return [
        DailyCheckResponse(
            id=check.id,
            check_date=check.check_date,
            responses=check.responses,
            completed_at=check.completed_at
        )
        for check in checks
    ]
