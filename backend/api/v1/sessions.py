"""
Session API endpoints.

Handles Ignition (start), Braking (end), and session management.
"""
import logging
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from models.user import User
from models.session import SessionCreate, SessionEnd, SessionResponse
from services.session_service import session_service
from dependencies.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def start_session(
    session_data: SessionCreate,
    current_user: User = Depends(get_current_user)
) -> SessionResponse:
    """
    Start session (Ignition).
    
    Args:
        session_data: Session creation data
        current_user: Authenticated user
        
    Returns:
        Created session
        
    Raises:
        HTTPException: 409 if active session already exists
    """
    try:
        session = session_service.start_session(
            user_id=str(current_user.id),
            session_data=session_data
        )
        
        logger.info(f"Session started for user: {current_user.id}")
        
        return SessionResponse(
            id=session.id,
            setup_id=session.setup_id,
            start_time=session.start_time,
            end_time=session.end_time,
            duration_minutes=session.duration_minutes,
            next_step=session.next_step,
            status=session.status,
            reduced_mode_active=session.reduced_mode_active
        )
        
    except Exception as e:
        error_msg = str(e)
        if "unable to start" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Unable to start right now. Try again in a moment."
            )
        
        logger.error(f"Failed to start session: {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to start session. Try again in a moment."
        )


@router.patch("/{session_id}/end", response_model=SessionResponse)
async def end_session(
    session_id: str,
    end_data: SessionEnd,
    current_user: User = Depends(get_current_user)
) -> SessionResponse:
    """
    End session (Braking).
    
    Args:
        session_id: Session UUID
        end_data: Session end data (next step)
        current_user: Authenticated user
        
    Returns:
        Updated session
        
    Raises:
        HTTPException: 404 if session not found, 400 if not active
    """
    try:
        session = session_service.end_session(
            session_id=session_id,
            user_id=str(current_user.id),
            end_data=end_data
        )
        
        logger.info(f"Session ended: {session_id}")
        
        return SessionResponse(
            id=session.id,
            setup_id=session.setup_id,
            start_time=session.start_time,
            end_time=session.end_time,
            duration_minutes=session.duration_minutes,
            next_step=session.next_step,
            status=session.status,
            reduced_mode_active=session.reduced_mode_active
        )
        
    except Exception as e:
        error_msg = str(e)
        if "not found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found."
            )
        
        logger.error(f"Failed to end session: {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to end session. Try again in a moment."
        )


@router.patch("/{session_id}/abandon", response_model=SessionResponse)
async def abandon_session(
    session_id: str,
    current_user: User = Depends(get_current_user)
) -> SessionResponse:
    """
    Abandon session without penalty.
    
    Args:
        session_id: Session UUID
        current_user: Authenticated user
        
    Returns:
        Updated session
        
    Raises:
        HTTPException: 404 if session not found
    """
    try:
        session = session_service.abandon_session(
            session_id=session_id,
            user_id=str(current_user.id)
        )
        
        logger.info(f"Session abandoned: {session_id}")
        
        return SessionResponse(
            id=session.id,
            setup_id=session.setup_id,
            start_time=session.start_time,
            end_time=session.end_time,
            duration_minutes=session.duration_minutes,
            next_step=session.next_step,
            status=session.status,
            reduced_mode_active=session.reduced_mode_active
        )
        
    except Exception as e:
        error_msg = str(e)
        if "not found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found."
            )
        
        logger.error(f"Failed to abandon session: {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to abandon session. Try again in a moment."
        )


@router.get("/active", response_model=SessionResponse)
async def get_active_session(
    current_user: User = Depends(get_current_user)
) -> SessionResponse:
    """
    Get active session if exists.
    
    Args:
        current_user: Authenticated user
        
    Returns:
        Active session
        
    Raises:
        HTTPException: 404 if no active session
    """
    session = session_service.get_active_session(
        user_id=str(current_user.id)
    )
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active session."
        )
    
    return SessionResponse(
        id=session.id,
        setup_id=session.setup_id,
        start_time=session.start_time,
        end_time=session.end_time,
        duration_minutes=session.duration_minutes,
        next_step=session.next_step,
        status=session.status,
        reduced_mode_active=session.reduced_mode_active
    )


@router.get("/recent", response_model=List[SessionResponse])
async def get_recent_sessions(
    limit: int = Query(30, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user)
) -> List[SessionResponse]:
    """
    Get recent sessions with pagination.
    
    Args:
        limit: Maximum number of sessions to return (1-100)
        offset: Number of sessions to skip
        current_user: Authenticated user
        
    Returns:
        List of sessions in reverse chronological order
    """
    sessions = session_service.get_recent_sessions(
        user_id=str(current_user.id),
        limit=limit,
        offset=offset
    )
    
    return [
        SessionResponse(
            id=session.id,
            setup_id=session.setup_id,
            start_time=session.start_time,
            end_time=session.end_time,
            duration_minutes=session.duration_minutes,
            next_step=session.next_step,
            status=session.status,
            reduced_mode_active=session.reduced_mode_active
        )
        for session in sessions
    ]
