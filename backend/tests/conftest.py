"""
Pytest configuration and shared fixtures.

Provides common test fixtures and configuration for all tests.
"""
import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    """Provide a test client for the FastAPI application."""
    return TestClient(app)


@pytest.fixture
def sample_user_id():
    """Provide a sample user ID for testing."""
    return "550e8400-e29b-41d4-a716-446655440000"


@pytest.fixture
def sample_setup_id():
    """Provide a sample setup ID for testing."""
    return "660e8400-e29b-41d4-a716-446655440000"
