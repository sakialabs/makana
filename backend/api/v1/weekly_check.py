"""
Weekly Check API endpoints.

Handles weekly reflection creation and history retrieval.
"""
import logging
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from models.user import User
from models.weekly_check import WeeklyCheckCreate, WeeklyCheckResponse
from services.weekly_check_service import weekly_check_service
from dependencies.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/weekly-check", tags=["weekly-check"])


@router.post("", response_model=WeeklyCheckResponse, status_code=status.HTTP_201_CREATED)
async def create_weekly_check(
    check_data: WeeklyCheckCreate,
    current_user: User = Depends(get_current_user)
) -> WeeklyCheckResponse:
    """
    Create weekly review.
    
    Args:
        check_data: Weekly check responses
        current_user: Authenticated user
        
    Returns:
        Created weekly check with insight and recommendation
    """
    try:
        check = weekly_check_service.create_weekly_check(
            user_id=str(current_user.id),
            check_data=check_data
        )
        
        logger.info(f"Weekly check created for user: {current_user.id}")
        
        return WeeklyCheckResponse(
            id=check.id,
            week_start_date=check.week_start_date,
            week_end_date=check.week_end_date,
            responses=check.responses,
            insight=check.insight,
            scope_recommendation=check.scope_recommendation,
            completed_at=check.completed_at
        )
        
    except Exception as e:
        logger.error(f"Failed to create weekly check: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to create weekly check. Try again in a moment."
        )


@router.get("/latest", response_model=WeeklyCheckResponse)
async def get_latest_check(
    current_user: User = Depends(get_current_user)
) -> WeeklyCheckResponse:
    """
    Get most recent weekly check.
    
    Args:
        current_user: Authenticated user
        
    Returns:
        Latest weekly check
        
    Raises:
        HTTPException: 404 if no checks exist
    """
    check = weekly_check_service.get_latest_check(
        user_id=str(current_user.id)
    )
    
    if not check:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No weekly checks found."
        )
    
    return WeeklyCheckResponse(
        id=check.id,
        week_start_date=check.week_start_date,
        week_end_date=check.week_end_date,
        responses=check.responses,
        insight=check.insight,
        scope_recommendation=check.scope_recommendation,
        completed_at=check.completed_at
    )


@router.get("/history", response_model=List[WeeklyCheckResponse])
async def get_check_history(
    limit: int = Query(12, ge=1, le=52),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user)
) -> List[WeeklyCheckResponse]:
    """
    Get past weekly checks with pagination.
    
    Args:
        limit: Maximum number of checks to return (1-52)
        offset: Number of checks to skip
        current_user: Authenticated user
        
    Returns:
        List of weekly checks in reverse chronological order
    """
    checks = weekly_check_service.get_check_history(
        user_id=str(current_user.id),
        limit=limit,
        offset=offset
    )
    
    return [
        WeeklyCheckResponse(
            id=check.id,
            week_start_date=check.week_start_date,
            week_end_date=check.week_end_date,
            responses=check.responses,
            insight=check.insight,
            scope_recommendation=check.scope_recommendation,
            completed_at=check.completed_at
        )
        for check in checks
    ]
