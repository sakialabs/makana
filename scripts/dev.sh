#!/bin/bash
# Start Makana development environment

echo "🚀 Starting Makana development environment"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env with your Supabase credentials before continuing."
    exit 1
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up

# Note: API will be available at http://localhost:8000
# Docs at http://localhost:8000/docs
