"""
Unit tests for rules engine.

Tests deterministic logic for duration, recommendations, and insights.
"""
import pytest
from datetime import datetime
from services.rules_engine import (
    calculate_session_duration,
    should_recommend_reduced_mode,
    generate_insight
)
from models.setup import Setup


@pytest.fixture
def calm_setup():
    """Create Calm setup for testing."""
    from uuid import UUID
    return Setup(
        id=UUID("550e8400-e29b-41d4-a716-446655440001"),
        name="Calm",
        description="Default 25 minutes",
        default_session_duration=25,
        emphasis="rest",
        is_preset=True,
        created_at=datetime.utcnow()
    )


@pytest.fixture
def vitality_setup():
    """Create Vitality setup for testing."""
    from uuid import UUID
    return Setup(
        id=UUID("550e8400-e29b-41d4-a716-446655440003"),
        name="Vitality",
        description="Default 30 minutes",
        default_session_duration=30,
        emphasis="health",
        is_preset=True,
        created_at=datetime.utcnow()
    )


class TestCalculateSessionDuration:
    """Tests for calculate_session_duration function."""
    
    def test_normal_mode_returns_default_duration(self, calm_setup):
        """Test that normal mode returns setup's default duration."""
        duration = calculate_session_duration(calm_setup, reduced_mode=False)
        assert duration == 25
    
    def test_reduced_mode_returns_60_percent(self, calm_setup):
        """Test that reduced mode returns 60% of default duration."""
        duration = calculate_session_duration(calm_setup, reduced_mode=True)
        assert duration == 15  # 25 * 0.6 = 15
    
    def test_vitality_normal_mode(self, vitality_setup):
        """Test Vitality setup in normal mode."""
        duration = calculate_session_duration(vitality_setup, reduced_mode=False)
        assert duration == 30
    
    def test_vitality_reduced_mode(self, vitality_setup):
        """Test Vitality setup in reduced mode."""
        duration = calculate_session_duration(vitality_setup, reduced_mode=True)
        assert duration == 18  # 30 * 0.6 = 18
    
    def test_deterministic_behavior(self, calm_setup):
        """Test that same inputs produce same outputs."""
        duration1 = calculate_session_duration(calm_setup, reduced_mode=True)
        duration2 = calculate_session_duration(calm_setup, reduced_mode=True)
        assert duration1 == duration2


class TestShouldRecommendReducedMode:
    """Tests for should_recommend_reduced_mode function."""
    
    def test_low_completion_rate_recommends_reduced_mode(self):
        """Test that low completion rate triggers recommendation."""
        week_data = {
            'sessions_completed': 2,
            'sessions_abandoned': 5,
            'daily_checks_completed': 5
        }
        
        result = should_recommend_reduced_mode(week_data)
        assert result is True  # 2/7 = 28% < 50%
    
    def test_low_daily_checks_recommends_reduced_mode(self):
        """Test that low daily check count triggers recommendation."""
        week_data = {
            'sessions_completed': 5,
            'sessions_abandoned': 1,
            'daily_checks_completed': 2
        }
        
        result = should_recommend_reduced_mode(week_data)
        assert result is True  # 2 < 3
    
    def test_good_completion_rate_no_recommendation(self):
        """Test that good completion rate doesn't trigger recommendation."""
        week_data = {
            'sessions_completed': 5,
            'sessions_abandoned': 1,
            'daily_checks_completed': 6
        }
        
        result = should_recommend_reduced_mode(week_data)
        assert result is False  # 5/6 = 83% > 50%, 6 > 3
    
    def test_no_sessions_with_low_checks_recommends(self):
        """Test that no sessions but low checks triggers recommendation."""
        week_data = {
            'sessions_completed': 0,
            'sessions_abandoned': 0,
            'daily_checks_completed': 1
        }
        
        result = should_recommend_reduced_mode(week_data)
        assert result is True  # 1 < 3
    
    def test_deterministic_behavior(self):
        """Test that same inputs produce same outputs."""
        week_data = {
            'sessions_completed': 3,
            'sessions_abandoned': 4,
            'daily_checks_completed': 4
        }
        
        result1 = should_recommend_reduced_mode(week_data)
        result2 = should_recommend_reduced_mode(week_data)
        assert result1 == result2


class TestGenerateInsight:
    """Tests for generate_insight function."""
    
    def test_clean_stops_insight(self):
        """Test that high clean stop rate generates insight."""
        week_data = {
            'sessions_completed': 5,
            'sessions_with_next_step': 4
        }
        
        insight = generate_insight("user123", week_data)
        assert insight == "Clean stops this week."
    
    def test_continuity_insight(self):
        """Test that 4+ sessions generates continuity insight."""
        week_data = {
            'sessions_completed': 4,
            'sessions_with_next_step': 2
        }
        
        insight = generate_insight("user123", week_data)
        assert insight == "Continuity maintained."
    
    def test_no_insight_for_low_activity(self):
        """Test that low activity generates no insight."""
        week_data = {
            'sessions_completed': 1,
            'sessions_with_next_step': 0
        }
        
        insight = generate_insight("user123", week_data)
        assert insight is None
    
    def test_at_most_one_insight(self):
        """Test that at most one insight is generated."""
        week_data = {
            'sessions_completed': 5,
            'sessions_with_next_step': 5  # Both conditions met
        }
        
        insight = generate_insight("user123", week_data)
        assert insight is not None
        assert isinstance(insight, str)
    
    def test_deterministic_behavior(self):
        """Test that same inputs produce same outputs."""
        week_data = {
            'sessions_completed': 5,
            'sessions_with_next_step': 4
        }
        
        insight1 = generate_insight("user123", week_data)
        insight2 = generate_insight("user123", week_data)
        assert insight1 == insight2
