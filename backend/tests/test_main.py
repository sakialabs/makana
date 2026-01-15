"""
Tests for main application endpoints.

Validates health check and root endpoints work correctly.
"""
import pytest


@pytest.mark.unit
def test_health_check(client):
    """Test health check endpoint returns healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "environment" in data


@pytest.mark.unit
def test_root_endpoint(client):
    """Test root endpoint returns API information."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Makana API"
    assert data["version"] == "0.1.0"
