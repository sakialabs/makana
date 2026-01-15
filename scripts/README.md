# Development Scripts

Helper scripts for Makana development workflow.

## Initial Setup

Run once to set up your development environment:

```bash
# Bash
./scripts/setup.sh

# PowerShell
.\scripts\setup.ps1
```

Creates Conda environment and installs dependencies.

## Development

Start the development environment:

```bash
# Bash
./scripts/dev.sh

# PowerShell
.\scripts\dev.ps1
```

Starts Docker services (API + PostgreSQL). API available at `http://localhost:8000`.

## Testing

Run the test suite:

```bash
# Bash
./scripts/test.sh

# PowerShell
.\scripts\test.ps1
```

Runs all tests with coverage report.

## API Testing

Get API testing commands:

```bash
# Bash
./scripts/api-test.sh

# PowerShell
.\scripts\api-test.ps1
```

Shows curl commands for manual API testing. For interactive testing, visit `http://localhost:8000/docs`.

## Notes

- All scripts check prerequisites before running
- Scripts provide clear error messages and next steps
- Use bash scripts on macOS/Linux, PowerShell on Windows
- Make bash scripts executable: `chmod +x scripts/*.sh`
