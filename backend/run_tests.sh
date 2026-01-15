#!/bin/bash
# Test runner script for Makana backend

echo "🧪 Running Makana Backend Tests"
echo "================================"
echo ""

# Run all tests with coverage
echo "📊 Running all tests with coverage..."
pytest --cov=. --cov-report=term-missing --cov-report=html -v

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
    echo ""
    echo "📈 Coverage report generated in htmlcov/index.html"
else
    echo ""
    echo "❌ Some tests failed. Please review the output above."
    exit 1
fi
