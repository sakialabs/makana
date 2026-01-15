# Testing Guide

Makana uses a comprehensive testing strategy combining unit tests, property-based tests, and integration tests to ensure correctness and reliability.

## Testing Philosophy

Makana treats testing as essential to building correct software. We use:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property-based tests**: Verify universal properties across all inputs (100+ iterations)
- **Integration tests**: Verify end-to-end flows and cross-component interactions

Both unit and property tests are complementary and necessary for comprehensive coverage.

## Setup

### Prerequisites

- Python 3.11+ (via Conda environment)
- All dependencies installed from `requirements.txt`

### Install Test Dependencies

If using Conda:
```bash
conda activate makana
```

Dependencies are already included in `requirements.txt`:
- `pytest` - Test framework
- `pytest-asyncio` - Async test support
- `hypothesis` - Property-based testing
- `pytest-cov` - Coverage reporting

## Running Tests

### All Tests

Run the complete test suite:
```bash
cd backend
pytest

# With coverage
pytest --cov=. --cov-report=html

# Using test runner scripts
./run_tests.sh        # Bash
./run_tests.ps1       # PowerShell
```

### By Test Type

Run specific test categories:
```bash
# Unit tests only
pytest -m unit

# Property-based tests only
pytest -m property

# Integration tests only
pytest -m integration

# Exclude slow tests
pytest -m "not slow"
```

### With Coverage

Generate coverage reports:
```bash
# Terminal output
pytest --cov=. --cov-report=term-missing

# HTML report
pytest --cov=. --cov-report=html
# Open htmlcov/index.html in browser

# Both
pytest --cov=. --cov-report=term-missing --cov-report=html
```

### Verbose Output

See detailed test output:
```bash
pytest -v
pytest -vv  # Extra verbose
```

### Specific Tests

Run individual test files or functions:
```bash
# Single file
pytest tests/test_main.py

# Single test function
pytest tests/test_main.py::test_health_check

# Tests matching pattern
pytest -k "health"
```

## Writing Tests

### Unit Tests

Unit tests verify specific examples and edge cases:

```python
import pytest

@pytest.mark.unit
def test_session_duration_calculation():
    """Test that session duration is calculated correctly."""
    setup = Setup(default_session_duration=25)
    
    # Normal mode
    duration = calculate_session_duration(setup, reduced_mode=False)
    assert duration == 25
    
    # Reduced mode (60% of default)
    reduced_duration = calculate_session_duration(setup, reduced_mode=True)
    assert reduced_duration == 15
```

### Property-Based Tests

Property tests verify universal properties across many generated inputs:

```python
from hypothesis import given, strategies as st
import pytest

@pytest.mark.property
@given(
    email=st.emails(),
    password=st.text(min_size=8, max_size=128)
)
def test_property_user_account_creation(email, password):
    """
    Feature: makana-v0-foundation, Property 1: User account creation succeeds for valid credentials
    Validates: Requirements 1.1
    """
    # Create account
    user = create_user_account(email, password)
    
    # Verify account exists and is retrievable
    retrieved_user = get_user_by_email(email)
    assert retrieved_user is not None
    assert retrieved_user.email == email
```

**Property Test Guidelines:**
- Minimum 100 iterations per test (configured in `pytest.ini`)
- Include feature tag and property number in docstring
- Reference design document property
- Use realistic data generators

### Integration Tests

Integration tests verify end-to-end flows:

```python
import pytest

@pytest.mark.integration
async def test_complete_session_flow(client, auth_token):
    """Test complete user flow: ignition → active → braking."""
    # Start session (Ignition)
    response = client.post(
        "/api/v1/sessions",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"setup_id": "calm"}
    )
    assert response.status_code == 200
    session = response.json()
    assert session["status"] == "active"
    
    # End session (Braking)
    response = client.patch(
        f"/api/v1/sessions/{session['id']}/end",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"next_step": "Review design document"}
    )
    assert response.status_code == 200
    ended_session = response.json()
    assert ended_session["status"] == "completed"
    assert ended_session["next_step"] == "Review design document"
```

## Test Markers

Tests are organized with pytest markers:

- `@pytest.mark.unit` - Unit tests
- `@pytest.mark.property` - Property-based tests
- `@pytest.mark.integration` - Integration tests
- `@pytest.mark.slow` - Slow-running tests

## Fixtures

Common fixtures are defined in `tests/conftest.py`:

```python
@pytest.fixture
def client():
    """Provide a test client for the FastAPI application."""
    return TestClient(app)

@pytest.fixture
def sample_user_id():
    """Provide a sample user ID for testing."""
    return "550e8400-e29b-41d4-a716-446655440000"
```

## Coverage Goals

- **Core logic**: >80% coverage required
- **Services**: >80% coverage required
- **API endpoints**: >70% coverage required
- **Configuration**: Coverage not required

## Continuous Integration

Tests run automatically on every commit:

1. All unit tests must pass
2. All property tests must pass (100 iterations)
3. No accessibility violations
4. Code coverage meets thresholds
5. No regressions in existing tests

## Debugging Tests

### Failed Tests

When tests fail:

1. Read the error message carefully
2. Check the test output for details
3. Run the specific test in verbose mode:
   ```bash
   pytest tests/test_file.py::test_name -vv
   ```
4. Use `pytest --pdb` to drop into debugger on failure

### Property Test Failures

When property tests fail, Hypothesis provides a minimal failing example:

```
Falsifying example: test_property_name(
    email='a@b.c',
    password='12345678'
)
```

Use this example to:
1. Understand why the property failed
2. Fix the code or adjust the property
3. Add a unit test for the specific case

## Best Practices

1. **Write tests first**: Consider TDD for new features
2. **Test behavior, not implementation**: Focus on what, not how
3. **Use descriptive names**: Test names should explain what they verify
4. **Keep tests focused**: One concept per test
5. **Use fixtures**: Share setup code via fixtures
6. **Mock external services**: Don't depend on external APIs in tests
7. **Test edge cases**: Empty inputs, boundary values, null handling
8. **Property tests for algorithms**: Use property tests for core logic
9. **Integration tests for flows**: Use integration tests for user journeys
10. **Keep tests fast**: Slow tests discourage running them

## Troubleshooting

### Tests Not Found

If pytest can't find tests:
```bash
# Verify test discovery
pytest --collect-only

# Check pytest.ini configuration
cat pytest.ini
```

### Import Errors

If tests have import errors:
```bash
# Ensure you're in the backend directory
cd backend

# Verify Python path
python -c "import sys; print(sys.path)"
```

### Async Test Issues

If async tests fail:
```bash
# Ensure pytest-asyncio is installed
pip install pytest-asyncio

# Check pytest.ini has asyncio_mode = auto
```

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [Hypothesis Documentation](https://hypothesis.readthedocs.io/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [Design Document](docs/design.md) - See Correctness Properties section
- [Requirements Document](docs/requirements.md) - See acceptance criteria

## API Testing

### Quick Start

Start the API:
```bash
docker-compose up
# API at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Interactive Testing

Use Swagger UI at `http://localhost:8000/docs`:
1. Click "Authorize" button
2. Enter your access token
3. Try endpoints with "Try it out"

### Manual Testing

```bash
# Sign up
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Sign in (get token)
TOKEN=$(curl -X POST http://localhost:8000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.access_token')

# Create daily check
curl -X POST http://localhost:8000/api/v1/daily-check \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"responses":{"energy":"medium"}}'

# Start session
curl -X POST http://localhost:8000/api/v1/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"setup_id":"00000000-0000-0000-0000-000000000001"}'
```

## Questions?

If you encounter issues or have questions about testing:
1. Check this guide first
2. Review the design document for property definitions
3. Look at existing tests for examples
4. Ask the team for guidance

Remember: Testing is not optional. It's how we ensure Makana works correctly and respects users' trust.


## Manual Testing Flows

### Test Flow 1: User Authentication
1. Navigate to auth page
2. Sign up with new email/password
3. Verify redirect to dashboard
4. Sign out
5. Sign in with same credentials
6. Verify successful authentication

**Expected**: Smooth auth flow, calm error messages, no technical jargon

### Test Flow 2: Daily Check
1. Complete daily check with responses
2. Verify submission success
3. Try submitting again same day
4. Verify duplicate prevention with calm message
5. View daily check history
6. Verify past checks displayed

**Expected**: One check per day, encouraging empty states, no pressure

### Test Flow 3: Session Lifecycle
1. Start session (Ignition)
2. Verify timer countdown
3. Wait for session to complete OR stop early
4. Complete braking (optional next step)
5. View session history
6. Verify session recorded

**Expected**: Clean stops, optional next step, no metrics or streaks

### Test Flow 4: Reduced Mode
1. Activate reduced mode
2. Verify duration adjustment (60% of normal)
3. Start session in reduced mode
4. Verify reduced duration displayed
5. Deactivate reduced mode
6. Verify normal duration restored

**Expected**: No penalties, calm messaging, respectful of capacity

### Test Flow 5: Cross-Platform Consistency
1. Complete flow on web
2. Complete same flow on mobile
3. Verify identical behavior
4. Verify data syncs across platforms

**Expected**: Same experience, same data, same calm tone

## Test Coverage Summary

**Backend**: 68% coverage (43/43 tests passing)
- Models: 100%
- Auth Service: 94%
- Daily Check Service: 88%
- Rules Engine: 98%
- Integration Tests: 100%

**Quality Standards**:
- All error messages use calm, non-technical language
- No blame language ("Unable to connect" not "You failed")
- Loading states are brief and respectful
- Empty states are encouraging, not judgmental
- Cross-platform consistency maintained


## Verification Checklist

### Backend Core Functionality ✅
- Authentication service with JWT validation
- Daily Check service with one-per-day enforcement
- Session service with Ignition/Braking lifecycle
- Reduced Mode service with capacity adaptation
- Weekly Check service with insight generation
- Setup service with preset management
- Rules engine with deterministic logic
- Database schema with RLS policies

### Web Client ✅
- All core pages implemented (Dashboard, Daily Check, Sessions, Weekly Check, Setups, Reduced Mode)
- React Query for state management
- Offline queue implementation
- API client with auth headers
- Supabase Auth integration
- Design system with Makana colors
- Accessibility features (keyboard nav, ARIA labels, focus indicators)
- Error handling with calm messages

### Mobile Client ✅
- All core screens implemented matching web functionality
- React Query for state management
- Offline queue implementation
- API client with auth headers
- Supabase Auth with secure storage
- Design system matching web
- Accessibility features (screen reader support, touch targets)
- Cross-platform consistency with web

### Design Compliance
- Color palette: Parchment background, Deep Olive accent, Charcoal text
- Typography: 16px base, 1.5 line-height for body
- Spacing: Minimum 16px between sections
- One primary action per screen
- No pressure mechanics (no streaks, leaderboards, metrics)
- Calm feedback throughout
- Short sentences, no blame language

### Performance Targets
- API response times < 200ms for p95
- Session start < 500ms from button click
- Page load < 2 seconds for initial view
- Offline queue persists across app restarts
- Queued changes sync within 5 seconds of connectivity
