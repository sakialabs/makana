"""
Unit tests for daily check service.

Tests daily check creation, retrieval, and duplicate prevention.
"""
import pytest
from datetime import date, datetime
from unittest.mock import Mock, patch
from services.daily_check_service import DailyCheckService
from models.daily_check import DailyCheck, DailyCheckCreate


@pytest.fixture
def daily_check_service():
    """Create daily check service instance with mocked Supabase client."""
    with patch('services.daily_check_service.create_client') as mock_create_client:
        mock_supabase = Mock()
        mock_create_client.return_value = mock_supabase
        
        service = DailyCheckService()
        yield service


class TestCreateDailyCheck:
    """Tests for create_daily_check function."""
    
    def test_create_new_check(self, daily_check_service):
        """Test creating a new daily check."""
        from uuid import uuid4
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        check_data = DailyCheckCreate(responses={"energy": "medium", "intention": "Focus"})
        
        # Mock no existing check
        mock_table = Mock()
        mock_select = Mock()
        mock_eq = Mock()
        
        mock_eq.execute.return_value = Mock(data=[])
        mock_select.eq.return_value = mock_eq
        mock_table.select.return_value = mock_select
        
        # Mock insert
        today = date.today()
        now = datetime.utcnow()
        check_id = str(uuid4())
        mock_insert = Mock()
        mock_insert.execute.return_value = Mock(data=[{
            "id": check_id,
            "user_id": user_id,
            "check_date": today.isoformat(),
            "responses": check_data.responses,
            "completed_at": now.isoformat(),
            "created_at": now.isoformat()
        }])
        mock_table.insert.return_value = mock_insert
        
        daily_check_service.supabase.table.return_value = mock_table
        
        # Create check
        check = daily_check_service.create_daily_check(user_id, check_data)
        
        from uuid import UUID
        assert check.user_id == UUID(user_id)
        assert check.check_date == today
        assert check.responses == check_data.responses
    
    def test_create_duplicate_check_raises_error(self, daily_check_service):
        """Test that duplicate check for same day raises error."""
        from uuid import uuid4, UUID
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        check_data = DailyCheckCreate(responses={"energy": "high"})
        
        # Mock get_today_check to return existing check
        today = date.today()
        now = datetime.utcnow()
        existing_check_id = str(uuid4())
        
        # Create a mock existing check
        existing_check = DailyCheck(
            id=UUID(existing_check_id),
            user_id=UUID(user_id),
            check_date=today,
            responses={"energy": "low"},
            completed_at=now,
            created_at=now
        )
        
        # Mock the get_today_check method to return existing check
        from unittest.mock import patch
        with patch.object(daily_check_service, 'get_today_check', return_value=existing_check):
            # Attempt to create duplicate
            with pytest.raises(Exception, match="Already completed today"):
                daily_check_service.create_daily_check(user_id, check_data)


class TestGetTodayCheck:
    """Tests for get_today_check function."""
    
    def test_get_existing_check(self, daily_check_service):
        """Test retrieving today's check."""
        from uuid import uuid4
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        today = date.today()
        
        # Mock existing check
        now = datetime.utcnow()
        check_id = str(uuid4())
        mock_table = Mock()
        mock_select = Mock()
        mock_eq1 = Mock()
        mock_eq2 = Mock()
        
        mock_eq2.execute.return_value = Mock(data=[{
            "id": check_id,
            "user_id": user_id,
            "check_date": today.isoformat(),
            "responses": {"energy": "medium"},
            "completed_at": now.isoformat(),
            "created_at": now.isoformat()
        }])
        mock_eq1.eq.return_value = mock_eq2
        mock_select.eq.return_value = mock_eq1
        mock_table.select.return_value = mock_select
        
        daily_check_service.supabase.table.return_value = mock_table
        
        # Get check
        check = daily_check_service.get_today_check(user_id, today)
        
        from uuid import UUID
        assert check is not None
        assert check.user_id == UUID(user_id)
        assert check.check_date == today
    
    def test_get_nonexistent_check_returns_none(self, daily_check_service):
        """Test that nonexistent check returns None."""
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        today = date.today()
        
        # Mock no check
        mock_table = Mock()
        mock_select = Mock()
        mock_eq1 = Mock()
        mock_eq2 = Mock()
        
        mock_eq2.execute.return_value = Mock(data=[])
        mock_eq1.eq.return_value = mock_eq2
        mock_select.eq.return_value = mock_eq1
        mock_table.select.return_value = mock_select
        
        daily_check_service.supabase.table.return_value = mock_table
        
        # Get check
        check = daily_check_service.get_today_check(user_id, today)
        
        assert check is None


class TestHasCompletedToday:
    """Tests for has_completed_today function."""
    
    def test_returns_true_when_check_exists(self, daily_check_service):
        """Test returns True when check exists for today."""
        from uuid import uuid4
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        today = date.today()
        
        # Mock existing check
        now = datetime.utcnow()
        check_id = str(uuid4())
        mock_table = Mock()
        mock_select = Mock()
        mock_eq1 = Mock()
        mock_eq2 = Mock()
        
        mock_eq2.execute.return_value = Mock(data=[{
            "id": check_id,
            "user_id": user_id,
            "check_date": today.isoformat(),
            "responses": {},
            "completed_at": now.isoformat(),
            "created_at": now.isoformat()
        }])
        mock_eq1.eq.return_value = mock_eq2
        mock_select.eq.return_value = mock_eq1
        mock_table.select.return_value = mock_select
        
        daily_check_service.supabase.table.return_value = mock_table
        
        # Check
        result = daily_check_service.has_completed_today(user_id)
        
        assert result is True
    
    def test_returns_false_when_no_check(self, daily_check_service):
        """Test returns False when no check exists for today."""
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        
        # Mock no check
        mock_table = Mock()
        mock_select = Mock()
        mock_eq1 = Mock()
        mock_eq2 = Mock()
        
        mock_eq2.execute.return_value = Mock(data=[])
        mock_eq1.eq.return_value = mock_eq2
        mock_select.eq.return_value = mock_eq1
        mock_table.select.return_value = mock_select
        
        daily_check_service.supabase.table.return_value = mock_table
        
        # Check
        result = daily_check_service.has_completed_today(user_id)
        
        assert result is False
