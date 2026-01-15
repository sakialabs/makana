"""
Unit tests for authentication service.

Tests JWT token verification, user profile creation, and retrieval.
"""
import pytest
from datetime import datetime, timedelta
from jose import jwt
from unittest.mock import Mock, patch, MagicMock
from services.auth_service import AuthService
from models.user import User, UserProfile


@pytest.fixture
def auth_service():
    """Create auth service instance with mocked Supabase client."""
    with patch('services.auth_service.create_client') as mock_create_client:
        mock_supabase = Mock()
        mock_create_client.return_value = mock_supabase
        
        service = AuthService()
        service.jwt_secret = "test-secret-key"
        
        yield service


@pytest.fixture
def valid_token(auth_service):
    """Generate a valid JWT token for testing."""
    payload = {
        "sub": "550e8400-e29b-41d4-a716-446655440000",
        "email": "test@example.com",
        "aud": "authenticated",
        "role": "authenticated",
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    
    token = jwt.encode(payload, auth_service.jwt_secret, algorithm="HS256")
    return token


@pytest.fixture
def expired_token(auth_service):
    """Generate an expired JWT token for testing."""
    payload = {
        "sub": "550e8400-e29b-41d4-a716-446655440000",
        "email": "test@example.com",
        "aud": "authenticated",
        "role": "authenticated",
        "exp": datetime.utcnow() - timedelta(hours=1)
    }
    
    token = jwt.encode(payload, auth_service.jwt_secret, algorithm="HS256")
    return token


class TestVerifyToken:
    """Tests for verify_token function."""
    
    def test_verify_valid_token(self, auth_service, valid_token):
        """Test that valid token is verified successfully."""
        from uuid import UUID
        user = auth_service.verify_token(valid_token)
        
        assert user.id == UUID("550e8400-e29b-41d4-a716-446655440000")
        assert user.email == "test@example.com"
        assert user.aud == "authenticated"
        assert user.role == "authenticated"
    
    def test_verify_expired_token_raises_error(self, auth_service, expired_token):
        """Test that expired token raises JWTError."""
        from jose import JWTError
        
        with pytest.raises(JWTError):
            auth_service.verify_token(expired_token)
    
    def test_verify_invalid_token_raises_error(self, auth_service):
        """Test that invalid token raises JWTError."""
        from jose import JWTError
        
        with pytest.raises(JWTError):
            auth_service.verify_token("invalid.token.here")
    
    def test_verify_token_missing_user_id_raises_error(self, auth_service):
        """Test that token without user_id raises JWTError."""
        from jose import JWTError
        
        payload = {
            "email": "test@example.com",
            "aud": "authenticated",
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        
        token = jwt.encode(payload, auth_service.jwt_secret, algorithm="HS256")
        
        with pytest.raises(JWTError):
            auth_service.verify_token(token)
    
    def test_verify_token_missing_email_raises_error(self, auth_service):
        """Test that token without email raises JWTError."""
        from jose import JWTError
        
        payload = {
            "sub": "550e8400-e29b-41d4-a716-446655440000",
            "aud": "authenticated",
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        
        token = jwt.encode(payload, auth_service.jwt_secret, algorithm="HS256")
        
        with pytest.raises(JWTError):
            auth_service.verify_token(token)


class TestCreateUserProfile:
    """Tests for create_user_profile function."""
    
    def test_create_new_profile(self, auth_service):
        """Test creating a new user profile."""
        from uuid import UUID
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        email = "test@example.com"
        
        # Mock Supabase table operations
        mock_table = Mock()
        mock_select = Mock()
        mock_eq = Mock()
        mock_insert = Mock()
        
        # Mock existing profile check (no existing profile)
        mock_eq.execute.return_value = Mock(data=[])
        mock_select.eq.return_value = mock_eq
        mock_table.select.return_value = mock_select
        
        # Mock profile creation
        now = datetime.utcnow()
        mock_insert.execute.return_value = Mock(data=[{
            "id": user_id,
            "email": email,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        }])
        mock_table.insert.return_value = mock_insert
        
        auth_service.supabase.table.return_value = mock_table
        
        # Create profile
        profile = auth_service.create_user_profile(user_id, email)
        
        assert profile.id == UUID(user_id)
        assert profile.email == email
        assert profile.created_at is not None
        assert profile.updated_at is not None
    
    def test_create_profile_when_already_exists(self, auth_service):
        """Test that existing profile is returned without creating duplicate."""
        from uuid import UUID
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        email = "test@example.com"
        
        # Mock Supabase table operations
        mock_table = Mock()
        mock_select = Mock()
        mock_eq = Mock()
        
        # Mock existing profile check (profile exists)
        now = datetime.utcnow()
        mock_eq.execute.return_value = Mock(data=[{
            "id": user_id,
            "email": email,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        }])
        mock_select.eq.return_value = mock_eq
        mock_table.select.return_value = mock_select
        
        auth_service.supabase.table.return_value = mock_table
        
        # Create profile (should return existing)
        profile = auth_service.create_user_profile(user_id, email)
        
        assert profile.id == UUID(user_id)
        assert profile.email == email
        
        # Verify insert was not called
        mock_table.insert.assert_not_called()


class TestGetUserProfile:
    """Tests for get_user_profile function."""
    
    def test_get_existing_profile(self, auth_service):
        """Test retrieving an existing user profile."""
        from uuid import UUID
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        email = "test@example.com"
        
        # Mock Supabase table operations
        mock_table = Mock()
        mock_select = Mock()
        mock_eq = Mock()
        
        now = datetime.utcnow()
        mock_eq.execute.return_value = Mock(data=[{
            "id": user_id,
            "email": email,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        }])
        mock_select.eq.return_value = mock_eq
        mock_table.select.return_value = mock_select
        
        auth_service.supabase.table.return_value = mock_table
        
        # Get profile
        profile = auth_service.get_user_profile(user_id)
        
        assert profile is not None
        assert profile.id == UUID(user_id)
        assert profile.email == email
    
    def test_get_nonexistent_profile_returns_none(self, auth_service):
        """Test that nonexistent profile returns None."""
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        
        # Mock Supabase table operations
        mock_table = Mock()
        mock_select = Mock()
        mock_eq = Mock()
        
        mock_eq.execute.return_value = Mock(data=[])
        mock_select.eq.return_value = mock_eq
        mock_table.select.return_value = mock_select
        
        auth_service.supabase.table.return_value = mock_table
        
        # Get profile
        profile = auth_service.get_user_profile(user_id)
        
        assert profile is None
    
    def test_get_profile_handles_database_error(self, auth_service):
        """Test that database errors are handled gracefully."""
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        
        # Mock Supabase table operations to raise error
        mock_table = Mock()
        mock_table.select.side_effect = Exception("Database connection error")
        
        auth_service.supabase.table.return_value = mock_table
        
        # Get profile (should return None on error)
        profile = auth_service.get_user_profile(user_id)
        
        assert profile is None
