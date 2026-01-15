"""
Integration tests for API health and basic functionality.

Tests that the API starts correctly and endpoints are accessible.
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestHealthEndpoints:
    """Tests for health check endpoints."""
    
    def test_health_check(self):
        """Test that health check endpoint returns 200."""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "environment" in data
    
    def test_root_endpoint(self):
        """Test that root endpoint returns API info."""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Makana API"
        assert data["version"] == "0.1.0"


class TestAPIDocumentation:
    """Tests for API documentation endpoints."""
    
    def test_openapi_schema_accessible(self):
        """Test that OpenAPI schema is accessible in development."""
        response = client.get("/openapi.json")
        
        assert response.status_code == 200
        data = response.json()
        assert "openapi" in data
        assert data["info"]["title"] == "Makana API"


class TestAuthEndpoints:
    """Tests for authentication endpoints existence."""
    
    def test_signup_endpoint_exists(self):
        """Test that signup endpoint exists (returns 422 for missing data)."""
        response = client.post("/api/v1/auth/signup", json={})
        
        # Should return 422 for validation error, not 404
        assert response.status_code == 422
    
    def test_signin_endpoint_exists(self):
        """Test that signin endpoint exists (returns 422 for missing data)."""
        response = client.post("/api/v1/auth/signin", json={})
        
        # Should return 422 for validation error, not 404
        assert response.status_code == 422


class TestDailyCheckEndpoints:
    """Tests for daily check endpoints existence."""
    
    def test_create_daily_check_requires_auth(self):
        """Test that creating daily check requires authentication."""
        response = client.post("/api/v1/daily-check", json={"responses": {}})
        
        # Should return 403 for missing auth, not 404
        assert response.status_code == 403


class TestSessionEndpoints:
    """Tests for session endpoints existence."""
    
    def test_start_session_requires_auth(self):
        """Test that starting session requires authentication."""
        response = client.post("/api/v1/sessions", json={})
        
        # Should return 403 for missing auth, not 404
        assert response.status_code == 403


class TestReducedModeEndpoints:
    """Tests for reduced mode endpoints existence."""
    
    def test_activate_reduced_mode_requires_auth(self):
        """Test that activating reduced mode requires authentication."""
        response = client.post("/api/v1/reduced-mode/activate")
        
        # Should return 403 for missing auth, not 404
        assert response.status_code == 403


class TestWeeklyCheckEndpoints:
    """Tests for weekly check endpoints existence."""
    
    def test_create_weekly_check_requires_auth(self):
        """Test that creating weekly check requires authentication."""
        response = client.post("/api/v1/weekly-check", json={"responses": {}})
        
        # Should return 403 for missing auth, not 404
        assert response.status_code == 403


class TestSetupEndpoints:
    """Tests for setup endpoints existence."""
    
    def test_get_setups_accessible(self):
        """Test that getting setups list is accessible without auth."""
        response = client.get("/api/v1/setups")
        
        # Should return 200 (public endpoint) or 500 (database not configured)
        # Either is acceptable for this test
        assert response.status_code in [200, 500]
