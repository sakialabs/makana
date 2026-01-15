# Makana Backend

A practice medium for developing intentional strength through starting, stopping, and alignment.

## Setup

### Prerequisites

- Python 3.11+ (via Conda recommended)
- Docker and Docker Compose (optional, recommended)
- Supabase account

### Option 1: Docker (Recommended)

See main [README.md](../README.md#-quick-start) for Docker setup.

### Option 2: Conda Environment

1. **Create environment** (from project root):
```bash
conda env create -f environment.yml
conda activate makana
```

2. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. **Run application**:
```bash
# Development mode with auto-reload
uvicorn main:app --reload

# Or using Python directly
python main.py
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

### Testing

See [testing.md](../docs/testing.md) for comprehensive testing guide.

Run all tests:
```bash
pytest
```

Run with coverage:
```bash
pytest --cov=. --cov-report=html
```

Run specific test types:
```bash
pytest -m unit          # Unit tests only
pytest -m property      # Property-based tests only
pytest -m integration   # Integration tests only
```

### Code Quality

Format code:
```bash
black .
```

Lint code:
```bash
ruff check .
```

Type check:
```bash
mypy .
```

Run all quality checks:
```bash
black . && ruff check . && mypy .
```

## Project Structure

```
backend/
├── config/              # Configuration and settings
│   ├── __init__.py
│   ├── settings.py      # Environment-based settings
│   └── logging.py       # Structured logging setup
├── services/            # Business logic services (to be added)
├── models/              # Data models (to be added)
├── tests/               # Test suite
│   ├── unit/           # Unit tests
│   ├── property/       # Property-based tests
│   └── integration/    # Integration tests
├── main.py             # Application entry point
├── requirements.txt    # Python dependencies
├── pytest.ini          # Pytest configuration
├── pyproject.toml      # Tool configuration (ruff, black, mypy)
├── Dockerfile          # Production Docker image
└── Dockerfile.dev      # Development Docker image
```

## Docker

### Development

```bash
# Build and run
docker-compose up

# Rebuild after dependency changes
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Production

```bash
# Build and run production image
docker-compose -f docker-compose.prod.yml up

# With resource limits
docker-compose -f docker-compose.prod.yml up
```

### Future: Redis and Celery (v1)

For background jobs and caching in v1:

```bash
# Start with Redis and Celery
docker-compose --profile v1 up

# This starts:
# - API
# - PostgreSQL
# - Redis (caching)
# - Celery (background jobs)
```

## Architecture

Makana follows a clean architecture with:
- **FastAPI** for REST API
- **Supabase** for database and authentication
- **Pydantic** for data validation
- **Hypothesis** for property-based testing
- **Redis** for caching (v1)
- **Celery** for background jobs (v1)

All core functionality is deterministic and does not require AI.

## Design Principles

- **Calm by default**: One primary action per screen, generous spacing
- **Deterministic first**: No AI required for core features
- **Privacy by design**: Minimal data collection, RLS enforcement
- **Respect for energy**: System adapts to user capacity
- **Continuity over intensity**: Support long-term practice

## Documentation

- [Main README](../README.md) - Project overview and quick start
- [Testing Guide](../docs/testing.md) - Comprehensive testing documentation
- [Requirements](../docs/requirements.md) - Functional requirements
- [Design](../docs/design.md) - System design and architecture
- [Tasks](../docs/tasks.md) - Implementation plan
- [Vision](../docs/vision.md) - Product vision and philosophy
- [Tone Guidelines](../docs/tone.md) - Voice and language guidelines
- [Manifesto](../docs/manifesto.md) - Core principles and beliefs
