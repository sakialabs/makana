#!/bin/bash
# Run Makana tests

echo "🧪 Running Makana tests"
echo "======================"
echo ""

cd backend

# Run tests with coverage
pytest --cov=. --cov-report=term-missing --cov-report=html -v

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
    echo "📈 Coverage report: backend/htmlcov/index.html"
else
    echo ""
    echo "❌ Some tests failed"
    exit 1
fi
