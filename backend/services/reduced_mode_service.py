"""
Reduced Mode service.

Manages capacity-aware state and adjusts session parameters.
"""
import logging
from typing import Optional
from datetime import datetime
from supabase import create_client, Client
from config import settings
from models.reduced_mode import ReducedModeState

logger = logging.getLogger(__name__)


class ReducedModeService:
    """Service for reduced mode management."""
    
    def __init__(self) -> None:
        """Initialize reduced mode service with Supabase client."""
        self.supabase: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
    
    def activate_reduced_mode(self, user_id: str) -> ReducedModeState:
        """
        Enable reduced mode with timestamp recording.
        
        Args:
            user_id: User UUID
            
        Returns:
            Updated ReducedModeState
            
        Examples:
            >>> service = ReducedModeService()
            >>> state = service.activate_reduced_mode(
            ...     "550e8400-e29b-41d4-a716-446655440000"
            ... )
            >>> assert state.is_active == True
        """
        try:
            # Get or create reduced mode state
            existing = self.get_reduced_mode_state(user_id)
            now = datetime.utcnow()
            
            if existing:
                # Update existing state (idempotent)
                if existing.is_active:
                    logger.info(f"Reduced mode already active for user: {user_id}")
                    return existing
                
                update_data = {
                    "is_active": True,
                    "activated_at": now.isoformat(),
                    "updated_at": now.isoformat()
                }
                
                result = self.supabase.table("reduced_mode_states").update(
                    update_data
                ).eq(
                    "user_id", user_id
                ).execute()
                
                logger.info(f"Reduced mode activated for user: {user_id}")
                return ReducedModeState(**result.data[0])
            
            # Create new state
            state_data = {
                "user_id": user_id,
                "is_active": True,
                "activated_at": now.isoformat(),
                "created_at": now.isoformat(),
                "updated_at": now.isoformat()
            }
            
            result = self.supabase.table("reduced_mode_states").insert(
                state_data
            ).execute()
            
            logger.info(f"Reduced mode state created and activated for user: {user_id}")
            return ReducedModeState(**result.data[0])
            
        except Exception as e:
            logger.error(f"Failed to activate reduced mode: {str(e)}")
            raise
    
    def deactivate_reduced_mode(self, user_id: str) -> ReducedModeState:
        """
        Disable reduced mode with timestamp recording.
        
        Args:
            user_id: User UUID
            
        Returns:
            Updated ReducedModeState
            
        Examples:
            >>> service = ReducedModeService()
            >>> state = service.deactivate_reduced_mode(
            ...     "550e8400-e29b-41d4-a716-446655440000"
            ... )
            >>> assert state.is_active == False
        """
        try:
            # Get or create reduced mode state
            existing = self.get_reduced_mode_state(user_id)
            now = datetime.utcnow()
            
            if existing:
                # Update existing state (idempotent)
                if not existing.is_active:
                    logger.info(f"Reduced mode already inactive for user: {user_id}")
                    return existing
                
                update_data = {
                    "is_active": False,
                    "deactivated_at": now.isoformat(),
                    "updated_at": now.isoformat()
                }
                
                result = self.supabase.table("reduced_mode_states").update(
                    update_data
                ).eq(
                    "user_id", user_id
                ).execute()
                
                logger.info(f"Reduced mode deactivated for user: {user_id}")
                return ReducedModeState(**result.data[0])
            
            # Create new state (already inactive by default)
            state_data = {
                "user_id": user_id,
                "is_active": False,
                "deactivated_at": now.isoformat(),
                "created_at": now.isoformat(),
                "updated_at": now.isoformat()
            }
            
            result = self.supabase.table("reduced_mode_states").insert(
                state_data
            ).execute()
            
            logger.info(f"Reduced mode state created (inactive) for user: {user_id}")
            return ReducedModeState(**result.data[0])
            
        except Exception as e:
            logger.error(f"Failed to deactivate reduced mode: {str(e)}")
            raise
    
    def get_reduced_mode_state(self, user_id: str) -> Optional[ReducedModeState]:
        """
        Get current reduced mode state.
        
        Args:
            user_id: User UUID
            
        Returns:
            ReducedModeState if found, None otherwise
        """
        try:
            result = self.supabase.table("reduced_mode_states").select("*").eq(
                "user_id", user_id
            ).execute()
            
            if result.data:
                return ReducedModeState(**result.data[0])
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get reduced mode state: {str(e)}")
            return None


# Global reduced mode service instance
reduced_mode_service = ReducedModeService()
