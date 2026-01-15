"""
Daily Check service.

Handles daily check-in records with one-per-day constraint.
"""
import logging
from typing import Optional, List
from datetime import date, datetime
from supabase import create_client, Client
from config import settings
from models.daily_check import DailyCheck, DailyCheckCreate

logger = logging.getLogger(__name__)


class DailyCheckService:
    """Service for daily check management."""
    
    def __init__(self) -> None:
        """Initialize daily check service with Supabase client."""
        self.supabase: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
    
    def create_daily_check(
        self,
        user_id: str,
        check_data: DailyCheckCreate
    ) -> DailyCheck:
        """
        Create daily check with duplicate prevention.
        
        Args:
            user_id: User UUID
            check_data: Daily check creation data
            
        Returns:
            Created DailyCheck
            
        Raises:
            Exception: If check already exists for today
            
        Examples:
            >>> service = DailyCheckService()
            >>> check = service.create_daily_check(
            ...     "550e8400-e29b-41d4-a716-446655440000",
            ...     DailyCheckCreate(responses={"energy": "medium"})
            ... )
            >>> assert check.check_date == date.today()
        """
        try:
            today = date.today()
            
            # Check if already completed today
            existing = self.get_today_check(user_id, today)
            if existing:
                logger.warning(f"Daily check already exists for user {user_id} on {today}")
                raise Exception("Already completed today.")
            
            # Create new check
            now = datetime.utcnow()
            check_record = {
                "user_id": user_id,
                "check_date": today.isoformat(),
                "responses": check_data.responses,
                "completed_at": now.isoformat(),
                "created_at": now.isoformat()
            }
            
            result = self.supabase.table("daily_checks").insert(
                check_record
            ).execute()
            
            logger.info(f"Daily check created for user: {user_id}")
            
            return DailyCheck(**result.data[0])
            
        except Exception as e:
            logger.error(f"Failed to create daily check: {str(e)}")
            raise
    
    def get_today_check(
        self,
        user_id: str,
        check_date: date
    ) -> Optional[DailyCheck]:
        """
        Get today's check if exists.
        
        Args:
            user_id: User UUID
            check_date: Date to check
            
        Returns:
            DailyCheck if found, None otherwise
        """
        try:
            result = self.supabase.table("daily_checks").select("*").eq(
                "user_id", user_id
            ).eq(
                "check_date", check_date.isoformat()
            ).execute()
            
            if result.data:
                return DailyCheck(**result.data[0])
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get today's check: {str(e)}")
            return None
    
    def has_completed_today(self, user_id: str) -> bool:
        """
        Fast boolean check if today's check exists.
        
        Args:
            user_id: User UUID
            
        Returns:
            True if check exists for today, False otherwise
        """
        today = date.today()
        check = self.get_today_check(user_id, today)
        return check is not None
    
    def get_check_history(
        self,
        user_id: str,
        limit: int = 30,
        offset: int = 0
    ) -> List[DailyCheck]:
        """
        Get past checks with pagination.
        
        Args:
            user_id: User UUID
            limit: Maximum number of checks to return
            offset: Number of checks to skip
            
        Returns:
            List of DailyCheck in reverse chronological order
        """
        try:
            result = self.supabase.table("daily_checks").select("*").eq(
                "user_id", user_id
            ).order(
                "check_date", desc=True
            ).range(
                offset, offset + limit - 1
            ).execute()
            
            return [DailyCheck(**check) for check in result.data]
            
        except Exception as e:
            logger.error(f"Failed to get check history: {str(e)}")
            return []


# Global daily check service instance
daily_check_service = DailyCheckService()
