"""
Setup API endpoints.

Handles preset setup listing and activation.
"""
import logging
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from models.user import User
from models.setup import SetupActivate, SetupResponse
from services.setup_service import setup_service
from dependencies.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/setups", tags=["setups"])


@router.get("", response_model=List[SetupResponse])
async def get_available_setups() -> List[SetupResponse]:
    """
    List available preset setups.
    
    Returns:
        List of available setups (Calm, Reduced, Vitality)
    """
    setups = setup_service.get_available_setups()
    
    return [
        SetupResponse(
            id=setup.id,
            name=setup.name,
            description=setup.description,
            default_session_duration=setup.default_session_duration,
            emphasis=setup.emphasis
        )
        for setup in setups
    ]


@router.post("/activate", status_code=status.HTTP_200_OK)
async def activate_setup(
    setup_data: SetupActivate,
    current_user: User = Depends(get_current_user)
) -> dict:
    """
    Activate a setup for the user.
    
    Args:
        setup_data: Setup activation data
        current_user: Authenticated user
        
    Returns:
        Success message
        
    Raises:
        HTTPException: 404 if setup not found
    """
    try:
        setup_service.activate_setup(
            user_id=str(current_user.id),
            setup_data=setup_data
        )
        
        logger.info(f"Setup activated for user: {current_user.id}")
        
        return {"message": "Setup activated."}
        
    except Exception as e:
        error_msg = str(e)
        if "not found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Setup not found."
            )
        
        logger.error(f"Failed to activate setup: {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to activate setup. Try again in a moment."
        )


@router.get("/active", response_model=SetupResponse)
async def get_active_setup(
    current_user: User = Depends(get_current_user)
) -> SetupResponse:
    """
    Get current active setup.
    
    Args:
        current_user: Authenticated user
        
    Returns:
        Active setup (defaults to Calm if none activated)
    """
    setup = setup_service.get_active_setup(
        user_id=str(current_user.id)
    )
    
    if not setup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active setup found."
        )
    
    return SetupResponse(
        id=setup.id,
        name=setup.name,
        description=setup.description,
        default_session_duration=setup.default_session_duration,
        emphasis=setup.emphasis
    )
