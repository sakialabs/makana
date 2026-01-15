"""
Rules engine.

Deterministic decision logic for duration, recommendations, and insights.
All functions are pure (same inputs → same outputs).
"""
import logging
from typing import Optional, Dict, Any
from models.setup import Setup

logger = logging.getLogger(__name__)


def calculate_session_duration(setup: Setup, reduced_mode: bool) -> int:
    """
    Determine session duration in minutes based on setup and reduced mode.
    
    Args:
        setup: The active setup configuration
        reduced_mode: Whether reduced mode is currently active
        
    Returns:
        Session duration in minutes
        
    Examples:
        >>> from models.setup import Setup
        >>> setup = Setup(
        ...     id="test",
        ...     name="Calm",
        ...     description="Test",
        ...     default_session_duration=25,
        ...     emphasis="rest",
        ...     is_preset=True,
        ...     created_at="2024-01-01T00:00:00Z"
        ... )
        >>> calculate_session_duration(setup, False)
        25
        >>> calculate_session_duration(setup, True)
        15
    """
    base_duration = setup.default_session_duration
    
    if reduced_mode:
        # Reduce by 40% (to 60% of default) in reduced mode
        return int(base_duration * 0.6)
    
    return base_duration


def should_recommend_reduced_mode(week_data: Dict[str, Any]) -> bool:
    """
    Evaluate if user should activate reduced mode based on week data.
    
    Args:
        week_data: Dictionary containing:
            - sessions_completed: int (number of completed sessions)
            - sessions_abandoned: int (number of abandoned sessions)
            - daily_checks_completed: int (number of daily checks)
            
    Returns:
        True if reduced mode should be recommended, False otherwise
        
    Examples:
        >>> should_recommend_reduced_mode({
        ...     'sessions_completed': 2,
        ...     'sessions_abandoned': 5,
        ...     'daily_checks_completed': 2
        ... })
        True
        >>> should_recommend_reduced_mode({
        ...     'sessions_completed': 5,
        ...     'sessions_abandoned': 1,
        ...     'daily_checks_completed': 6
        ... })
        False
    """
    sessions_completed = week_data.get('sessions_completed', 0)
    sessions_abandoned = week_data.get('sessions_abandoned', 0)
    daily_checks_completed = week_data.get('daily_checks_completed', 0)
    
    # Recommend if completion rate is low (< 50%)
    total_sessions = sessions_completed + sessions_abandoned
    if total_sessions > 0:
        completion_rate = sessions_completed / total_sessions
        if completion_rate < 0.5:
            return True
    
    # Recommend if daily check engagement is low (< 3 per week)
    if daily_checks_completed < 3:
        return True
    
    return False


def generate_insight(user_id: str, week_data: Dict[str, Any]) -> Optional[str]:
    """
    Generate at most one insight from week data.
    
    Args:
        user_id: User identifier (for future personalization)
        week_data: Dictionary containing:
            - sessions_completed: int
            - sessions_with_next_step: int (sessions where next_step was captured)
            
    Returns:
        One insight string or None if nothing notable
        
    Examples:
        >>> generate_insight('user123', {
        ...     'sessions_completed': 5,
        ...     'sessions_with_next_step': 4
        ... })
        'Clean stops this week.'
        >>> generate_insight('user123', {
        ...     'sessions_completed': 1,
        ...     'sessions_with_next_step': 0
        ... })
        
    """
    sessions_completed = week_data.get('sessions_completed', 0)
    clean_stops = week_data.get('sessions_with_next_step', 0)
    
    # Recognize clean stopping practice (80%+ of sessions have next step)
    if sessions_completed > 0:
        clean_stop_rate = clean_stops / sessions_completed
        if clean_stop_rate >= 0.8:
            return "Clean stops this week."
    
    # Recognize continuity (4+ sessions in a week)
    if sessions_completed >= 4:
        return "Continuity maintained."
    
    # No insight if nothing notable
    return None
