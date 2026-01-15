# Contributing to Makana

Thank you for your interest in contributing to Makana. This document will help you get started.

## Philosophy

Makana is a practice medium for developing intentional strength. We value:

- **Calm over urgency** - No pressure mechanics, no blame language
- **Continuity over intensity** - Support long-term practice, not short-term performance
- **Stability over novelty** - Core features don't change often, durability is valued
- **Privacy by design** - Minimal data collection, no third-party sharing
- **Respect for energy** - System adapts to user capacity, never demands consistency

Read our [manifesto](docs/manifesto.md) and [vision](docs/vision.md) to understand what we're building.

## Getting Started

### Prerequisites

- Python 3.11+ (via Conda)
- Docker and Docker Compose
- Git
- Supabase account (for database and auth)

### Setup

1. **Fork and clone**:
```bash
git clone https://github.com/sakialabs/makana.git
cd makana
```

2. **Run setup script**:
```bash
# Bash
./scripts/setup.sh

# PowerShell
.\scripts\setup.ps1
```

3. **Configure environment**:
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your Supabase credentials
```

4. **Start development**:
```bash
# Bash
./scripts/dev.sh

# PowerShell
.\scripts\dev.ps1
```

API will be available at `http://localhost:8000`.

## Development Workflow

### Making Changes

1. **Create a branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** following our guidelines below

3. **Run tests**:
```bash
./scripts/test.sh
```

4. **Commit with clear messages**:
```bash
git commit -m "Add feature: brief description"
```

5. **Push and create PR**:
```bash
git push origin feature/your-feature-name
```

### Code Guidelines

**Python (Backend)**:
- Use type hints for all functions
- Write docstrings with examples
- Follow PEP 8 (enforced by ruff and black)
- Keep functions small and focused
- Use calm, respectful error messages

**Testing**:
- Write unit tests for new functions
- Write property tests for universal behaviors
- Ensure tests pass before committing
- Aim for >80% coverage on new code

**Commit Messages**:
- Use present tense ("Add feature" not "Added feature")
- Be specific and concise
- Reference issues when applicable

### Error Messages

All error messages must be calm and respectful:

✅ Good:
- "Unable to start right now. Try again in a moment."
- "Already completed today."
- "Session not found."

❌ Avoid:
- "Error! You failed to start!"
- "Oops! Something went wrong!"
- "Invalid input. Fix your mistakes."

No blame, no urgency, no pressure.

## Project Structure

```
makana/
├── backend/         # FastAPI backend
│   ├── api/         # API endpoints
│   ├── services/    # Business logic
│   ├── models/      # Data models
│   ├── config/      # Configuration
│   └── tests/       # Test suite
├── docs/            # Documentation
├── scripts/         # Development scripts
└── migrations/      # Database migrations
```

## Testing

### Run All Tests
```bash
./scripts/test.sh
```

### Run Specific Tests
```bash
cd backend
pytest -m unit              # Unit tests only
pytest -m property          # Property tests only
pytest -m integration       # Integration tests only
```

### Manual API Testing
```bash
./scripts/api-test.sh       # Shows test commands
```

Or use interactive docs at `http://localhost:8000/docs`.

See [testing guide](docs/testing.md) for details.

## Documentation

When adding features:
- Update relevant docs in `docs/`
- Add docstrings to all functions
- Update `CHANGELOG.md` if significant
- Keep README focused and concise

## Pull Request Process

1. **Ensure tests pass** - All tests must pass
2. **Update documentation** - Keep docs current
3. **Follow code guidelines** - Consistent style
4. **Write clear PR description** - What and why
5. **Be patient** - We review thoughtfully, not urgently

### PR Template

```markdown
## What
Brief description of changes

## Why
Reason for changes

## Testing
How you tested the changes

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Error messages are calm
- [ ] Follows code guidelines
```

## Questions?

- Check [documentation](docs/)
- Review existing code
- Ask in discussions
- Open an issue

## Code of Conduct

Be respectful, patient, and kind. We're building a tool that respects human energy - let's extend that respect to each other.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Makana. Your work helps create a calm, reliable tool for intentional practice.
