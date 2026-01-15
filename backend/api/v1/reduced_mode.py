"""
Reduced Mode API endpoints.

Handles reduced mode activation, deactivation, and status.
"""
import logging
from fastapi import APIRouter, HTTPException, status, Depends
from models.user import User
from models.reduced_mode import ReducedModeResponse
from services.reduced_mode_service import reduced_mode_service
from dependencies.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reduced-mode", tags=["reduced-mode"])


@router.post("/activate", response_model=ReducedModeResponse)
async def activate_reduced_mode(
    current_user: User = Depends(get_current_user)
) -> ReducedModeResponse:
    """
    Enable reduced mode.
    
    Args:
        current_user: Authenticated user
        
    Returns:
        Updated reduced mode state
    """
    try:
        state = reduced_mode_service.activate_reduced_mode(
            user_id=str(current_user.id)
        )
        
        logger.info(f"Reduced mode activated for user: {current_user.id}")
        
        return ReducedModeResponse(
            is_active=state.is_active,
            activated_at=state.activated_at,
            deactivated_at=state.deactivated_at
        )
        
    except Exception as e:
        logger.error(f"Failed to activate reduced mode: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to activate reduced mode. Try again in a moment."
        )


@router.post("/deactivate", response_model=ReducedModeResponse)
async def deactivate_reduced_mode(
    current_user: User = Depends(get_current_user)
) -> ReducedModeResponse:
    """
    Disable reduced mode.
    
    Args:
        current_user: Authenticated user
        
    Returns:
        Updated reduced mode state
    """
    try:
        state = reduced_mode_service.deactivate_reduced_mode(
            user_id=str(current_user.id)
        )
        
        logger.info(f"Reduced mode deactivated for user: {current_user.id}")
        
        return ReducedModeResponse(
            is_active=state.is_active,
            activated_at=state.activated_at,
            deactivated_at=state.deactivated_at
        )
        
    except Exception as e:
        logger.error(f"Failed to deactivate reduced mode: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to deactivate reduced mode. Try again in a moment."
        )


@router.get("/status", response_model=ReducedModeResponse)
async def get_reduced_mode_status(
    current_user: User = Depends(get_current_user)
) -> ReducedModeResponse:
    """
    Get current reduced mode state.
    
    Args:
        current_user: Authenticated user
        
    Returns:
        Current reduced mode state
    """
    state = reduced_mode_service.get_reduced_mode_state(
        user_id=str(current_user.id)
    )
    
    if not state:
        # Return default inactive state if not found
        return ReducedModeResponse(
            is_active=False,
            activated_at=None,
            deactivated_at=None
        )
    
    return ReducedModeResponse(
        is_active=state.is_active,
        activated_at=state.activated_at,
        deactivated_at=state.deactivated_at
    )
