"""
Setup service.

Manages preset configurations and user setup activation.
"""
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from supabase import create_client, Client
from config import settings
from models.setup import Setup, UserSetup, SetupActivate

logger = logging.getLogger(__name__)


class SetupService:
    """Service for setup management."""
    
    def __init__(self) -> None:
        """Initialize setup service with Supabase client."""
        self.supabase: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
    
    def get_available_setups(self) -> List[Setup]:
        """
        Return all preset setups.
        
        Returns:
            List of available Setup presets
            
        Examples:
            >>> service = SetupService()
            >>> setups = service.get_available_setups()
            >>> assert len(setups) == 3  # Calm, Reduced, Vitality
        """
        try:
            result = self.supabase.table("setups").select("*").eq(
                "is_preset", True
            ).order("name").execute()
            
            return [Setup(**setup) for setup in result.data]
            
        except Exception as e:
            logger.error(f"Failed to get available setups: {str(e)}")
            return []
    
    def activate_setup(
        self,
        user_id: str,
        setup_data: SetupActivate
    ) -> UserSetup:
        """
        Activate a setup for user with timestamp recording.
        
        Args:
            user_id: User UUID
            setup_data: Setup activation data
            
        Returns:
            Created UserSetup
            
        Raises:
            Exception: If setup not found
            
        Examples:
            >>> service = SetupService()
            >>> user_setup = service.activate_setup(
            ...     "550e8400-e29b-41d4-a716-446655440000",
            ...     SetupActivate(setup_id="00000000-0000-0000-0000-000000000001")
            ... )
            >>> assert user_setup.setup_id is not None
        """
        try:
            # Verify setup exists
            setup_result = self.supabase.table("setups").select("*").eq(
                "id", str(setup_data.setup_id)
            ).execute()
            
            if not setup_result.data:
                raise Exception("Setup not found.")
            
            # Create user setup record
            now = datetime.utcnow()
            user_setup_data = {
                "user_id": user_id,
                "setup_id": str(setup_data.setup_id),
                "activated_at": now.isoformat(),
                "created_at": now.isoformat()
            }
            
            result = self.supabase.table("user_setups").insert(
                user_setup_data
            ).execute()
            
            logger.info(f"Setup activated for user {user_id}: {setup_data.setup_id}")
            
            return UserSetup(**result.data[0])
            
        except Exception as e:
            logger.error(f"Failed to activate setup: {str(e)}")
            raise
    
    def get_active_setup(self, user_id: str) -> Optional[Setup]:
        """
        Get current active setup for user.
        
        Args:
            user_id: User UUID
            
        Returns:
            Active Setup if found, None otherwise (defaults to Calm)
        """
        try:
            # Get most recent user setup
            user_setup_result = self.supabase.table("user_setups").select("*").eq(
                "user_id", user_id
            ).order(
                "activated_at", desc=True
            ).limit(1).execute()
            
            if not user_setup_result.data:
                # Return default Calm setup if no activation found
                return self.get_setup_by_name("Calm")
            
            setup_id = user_setup_result.data[0]["setup_id"]
            
            # Get setup details
            setup_result = self.supabase.table("setups").select("*").eq(
                "id", setup_id
            ).execute()
            
            if setup_result.data:
                return Setup(**setup_result.data[0])
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get active setup: {str(e)}")
            return None
    
    def get_setup_by_name(self, name: str) -> Optional[Setup]:
        """
        Get setup by name.
        
        Args:
            name: Setup name (Calm, Reduced, Vitality)
            
        Returns:
            Setup if found, None otherwise
        """
        try:
            result = self.supabase.table("setups").select("*").eq(
                "name", name
            ).execute()
            
            if result.data:
                return Setup(**result.data[0])
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get setup by name: {str(e)}")
            return None
    
    def get_setup_defaults(self, setup_id: str) -> Dict[str, Any]:
        """
        Get default parameters for a setup.
        
        Args:
            setup_id: Setup UUID
            
        Returns:
            Dictionary with setup parameters
        """
        try:
            result = self.supabase.table("setups").select("*").eq(
                "id", setup_id
            ).execute()
            
            if result.data:
                setup = result.data[0]
                return {
                    "duration": setup["default_session_duration"],
                    "emphasis": setup["emphasis"],
                    "name": setup["name"]
                }
            
            return {}
            
        except Exception as e:
            logger.error(f"Failed to get setup defaults: {str(e)}")
            return {}


# Global setup service instance
setup_service = SetupService()
