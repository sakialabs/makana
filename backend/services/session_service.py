"""
Session service.

Manages Ignition/Braking lifecycle, prevents concurrent sessions, tracks history.
"""
import logging
from typing import Optional, List
from datetime import datetime
from supabase import create_client, Client
from config import settings
from models.session import Session, SessionCreate, SessionEnd
from models.setup import Setup
from services.rules_engine import calculate_session_duration

logger = logging.getLogger(__name__)


class SessionService:
    """Service for session management."""
    
    def __init__(self) -> None:
        """Initialize session service with Supabase client."""
        self.supabase: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
    
    def start_session(
        self,
        user_id: str,
        session_data: SessionCreate
    ) -> Session:
        """
        Start new session with concurrent session prevention.
        
        Args:
            user_id: User UUID
            session_data: Session creation data
            
        Returns:
            Created Session
            
        Raises:
            Exception: If active session already exists
            
        Examples:
            >>> service = SessionService()
            >>> session = service.start_session(
            ...     "550e8400-e29b-41d4-a716-446655440000",
            ...     SessionCreate(setup_id="00000000-0000-0000-0000-000000000001")
            ... )
            >>> assert session.status == "active"
        """
        try:
            # Check for existing active session
            active_session = self.get_active_session(user_id)
            if active_session:
                logger.warning(f"User {user_id} already has active session")
                raise Exception("Unable to start right now. Try again in a moment.")
            
            # Get setup for duration calculation
            setup_result = self.supabase.table("setups").select("*").eq(
                "id", str(session_data.setup_id)
            ).execute()
            
            if not setup_result.data:
                raise Exception("Setup not found.")
            
            setup = Setup(**setup_result.data[0])
            
            # Get reduced mode state
            reduced_mode_result = self.supabase.table("reduced_mode_states").select("*").eq(
                "user_id", user_id
            ).execute()
            
            reduced_mode_active = False
            if reduced_mode_result.data:
                reduced_mode_active = reduced_mode_result.data[0].get("is_active", False)
            
            # Calculate duration
            duration = calculate_session_duration(setup, reduced_mode_active)
            
            # Create new session
            now = datetime.utcnow()
            session_record = {
                "user_id": user_id,
                "setup_id": str(session_data.setup_id),
                "start_time": now.isoformat(),
                "status": "active",
                "reduced_mode_active": reduced_mode_active,
                "duration_minutes": duration,
                "created_at": now.isoformat(),
                "updated_at": now.isoformat()
            }
            
            result = self.supabase.table("sessions").insert(
                session_record
            ).execute()
            
            logger.info(f"Session started for user: {user_id}")
            
            return Session(**result.data[0])
            
        except Exception as e:
            logger.error(f"Failed to start session: {str(e)}")
            raise
    
    def end_session(
        self,
        session_id: str,
        user_id: str,
        end_data: SessionEnd
    ) -> Session:
        """
        End session with duration calculation and next step capture.
        
        Args:
            session_id: Session UUID
            user_id: User UUID (for authorization)
            end_data: Session end data
            
        Returns:
            Updated Session
            
        Raises:
            Exception: If session not found or not active
        """
        try:
            # Get session
            session_result = self.supabase.table("sessions").select("*").eq(
                "id", session_id
            ).eq(
                "user_id", user_id
            ).execute()
            
            if not session_result.data:
                raise Exception("Session not found.")
            
            session = session_result.data[0]
            
            if session["status"] != "active":
                raise Exception("Session is not active.")
            
            # Calculate duration
            now = datetime.utcnow()
            start_time = datetime.fromisoformat(session["start_time"].replace('Z', '+00:00'))
            duration_minutes = int((now - start_time).total_seconds() / 60)
            
            # Update session
            update_data = {
                "end_time": now.isoformat(),
                "duration_minutes": duration_minutes,
                "status": "completed",
                "updated_at": now.isoformat()
            }
            
            if end_data.next_step:
                update_data["next_step"] = end_data.next_step
            
            result = self.supabase.table("sessions").update(
                update_data
            ).eq(
                "id", session_id
            ).execute()
            
            logger.info(f"Session ended: {session_id}")
            
            return Session(**result.data[0])
            
        except Exception as e:
            logger.error(f"Failed to end session: {str(e)}")
            raise
    
    def get_active_session(self, user_id: str) -> Optional[Session]:
        """
        Find active session for user (at most one).
        
        Args:
            user_id: User UUID
            
        Returns:
            Active Session if found, None otherwise
        """
        try:
            result = self.supabase.table("sessions").select("*").eq(
                "user_id", user_id
            ).eq(
                "status", "active"
            ).execute()
            
            if result.data:
                return Session(**result.data[0])
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get active session: {str(e)}")
            return None
    
    def abandon_session(
        self,
        session_id: str,
        user_id: str
    ) -> Session:
        """
        Mark session as abandoned without penalty.
        
        Args:
            session_id: Session UUID
            user_id: User UUID (for authorization)
            
        Returns:
            Updated Session
            
        Raises:
            Exception: If session not found or not active
        """
        try:
            # Get session
            session_result = self.supabase.table("sessions").select("*").eq(
                "id", session_id
            ).eq(
                "user_id", user_id
            ).execute()
            
            if not session_result.data:
                raise Exception("Session not found.")
            
            session = session_result.data[0]
            
            if session["status"] != "active":
                raise Exception("Session is not active.")
            
            # Update session
            now = datetime.utcnow()
            update_data = {
                "status": "abandoned",
                "updated_at": now.isoformat()
            }
            
            result = self.supabase.table("sessions").update(
                update_data
            ).eq(
                "id", session_id
            ).execute()
            
            logger.info(f"Session abandoned: {session_id}")
            
            return Session(**result.data[0])
            
        except Exception as e:
            logger.error(f"Failed to abandon session: {str(e)}")
            raise
    
    def get_recent_sessions(
        self,
        user_id: str,
        limit: int = 30,
        offset: int = 0
    ) -> List[Session]:
        """
        Get recent sessions with pagination.
        
        Args:
            user_id: User UUID
            limit: Maximum number of sessions to return
            offset: Number of sessions to skip
            
        Returns:
            List of Session in reverse chronological order
        """
        try:
            result = self.supabase.table("sessions").select("*").eq(
                "user_id", user_id
            ).order(
                "created_at", desc=True
            ).range(
                offset, offset + limit - 1
            ).execute()
            
            return [Session(**session) for session in result.data]
            
        except Exception as e:
            logger.error(f"Failed to get recent sessions: {str(e)}")
            return []


# Global session service instance
session_service = SessionService()
