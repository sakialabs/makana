"""
Weekly Check service.

Manages weekly reflection, generates insights, recommends scope adjustments.
"""
import logging
from typing import Optional, List, Dict, Any
from datetime import date, datetime, timedelta
from supabase import create_client, Client
from config import settings
from models.weekly_check import WeeklyCheck, WeeklyCheckCreate
from services.rules_engine import generate_insight, should_recommend_reduced_mode

logger = logging.getLogger(__name__)


class WeeklyCheckService:
    """Service for weekly check management."""
    
    def __init__(self) -> None:
        """Initialize weekly check service with Supabase client."""
        self.supabase: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
    
    def create_weekly_check(
        self,
        user_id: str,
        check_data: WeeklyCheckCreate
    ) -> WeeklyCheck:
        """
        Create weekly check with insight generation.
        
        Args:
            user_id: User UUID
            check_data: Weekly check creation data
            
        Returns:
            Created WeeklyCheck
            
        Examples:
            >>> service = WeeklyCheckService()
            >>> check = service.create_weekly_check(
            ...     "550e8400-e29b-41d4-a716-446655440000",
            ...     WeeklyCheckCreate(responses={"capacity": "good"})
            ... )
            >>> assert check.week_start_date is not None
        """
        try:
            # Calculate week boundaries (Monday to Sunday)
            today = date.today()
            week_start = today - timedelta(days=today.weekday())
            week_end = week_start + timedelta(days=6)
            
            # Get week data for insight generation
            week_data = self.get_week_data(user_id, week_start, week_end)
            
            # Generate insight (at most one)
            insight = generate_insight(user_id, week_data)
            
            # Generate scope recommendation
            scope_rec = self.recommend_scope_adjustment(week_data)
            
            # Create weekly check
            now = datetime.utcnow()
            check_record = {
                "user_id": user_id,
                "week_start_date": week_start.isoformat(),
                "week_end_date": week_end.isoformat(),
                "responses": check_data.responses,
                "insight": insight,
                "scope_recommendation": scope_rec,
                "completed_at": now.isoformat(),
                "created_at": now.isoformat()
            }
            
            result = self.supabase.table("weekly_checks").insert(
                check_record
            ).execute()
            
            logger.info(f"Weekly check created for user: {user_id}")
            
            return WeeklyCheck(**result.data[0])
            
        except Exception as e:
            logger.error(f"Failed to create weekly check: {str(e)}")
            raise
    
    def get_week_data(
        self,
        user_id: str,
        week_start: date,
        week_end: date
    ) -> Dict[str, Any]:
        """
        Aggregate week statistics for insight generation.
        
        Args:
            user_id: User UUID
            week_start: Monday of the week
            week_end: Sunday of the week
            
        Returns:
            Dictionary with week statistics
        """
        try:
            # Get sessions for the week
            sessions_result = self.supabase.table("sessions").select("*").eq(
                "user_id", user_id
            ).gte(
                "created_at", week_start.isoformat()
            ).lte(
                "created_at", (week_end + timedelta(days=1)).isoformat()
            ).execute()
            
            sessions = sessions_result.data
            
            # Calculate statistics
            sessions_completed = sum(1 for s in sessions if s["status"] == "completed")
            sessions_abandoned = sum(1 for s in sessions if s["status"] == "abandoned")
            sessions_with_next_step = sum(
                1 for s in sessions 
                if s["status"] == "completed" and s.get("next_step")
            )
            
            # Get daily checks for the week
            daily_checks_result = self.supabase.table("daily_checks").select("*").eq(
                "user_id", user_id
            ).gte(
                "check_date", week_start.isoformat()
            ).lte(
                "check_date", week_end.isoformat()
            ).execute()
            
            daily_checks_completed = len(daily_checks_result.data)
            
            return {
                "sessions_completed": sessions_completed,
                "sessions_abandoned": sessions_abandoned,
                "sessions_with_next_step": sessions_with_next_step,
                "daily_checks_completed": daily_checks_completed
            }
            
        except Exception as e:
            logger.error(f"Failed to get week data: {str(e)}")
            return {
                "sessions_completed": 0,
                "sessions_abandoned": 0,
                "sessions_with_next_step": 0,
                "daily_checks_completed": 0
            }
    
    def recommend_scope_adjustment(self, week_data: Dict[str, Any]) -> Optional[str]:
        """
        Suggest Reduced Mode if capacity signals are low.
        
        Args:
            week_data: Week statistics
            
        Returns:
            Recommendation string or None
        """
        if should_recommend_reduced_mode(week_data):
            return "Consider activating Reduced Mode for continuity."
        
        return None
    
    def get_latest_check(self, user_id: str) -> Optional[WeeklyCheck]:
        """
        Get most recent weekly check.
        
        Args:
            user_id: User UUID
            
        Returns:
            Latest WeeklyCheck if found, None otherwise
        """
        try:
            result = self.supabase.table("weekly_checks").select("*").eq(
                "user_id", user_id
            ).order(
                "week_start_date", desc=True
            ).limit(1).execute()
            
            if result.data:
                return WeeklyCheck(**result.data[0])
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get latest check: {str(e)}")
            return None
    
    def get_check_history(
        self,
        user_id: str,
        limit: int = 12,
        offset: int = 0
    ) -> List[WeeklyCheck]:
        """
        Get past weekly checks with pagination.
        
        Args:
            user_id: User UUID
            limit: Maximum number of checks to return
            offset: Number of checks to skip
            
        Returns:
            List of WeeklyCheck in reverse chronological order
        """
        try:
            result = self.supabase.table("weekly_checks").select("*").eq(
                "user_id", user_id
            ).order(
                "week_start_date", desc=True
            ).range(
                offset, offset + limit - 1
            ).execute()
            
            return [WeeklyCheck(**check) for check in result.data]
            
        except Exception as e:
            logger.error(f"Failed to get check history: {str(e)}")
            return []


# Global weekly check service instance
weekly_check_service = WeeklyCheckService()
