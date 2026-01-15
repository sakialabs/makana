#!/bin/bash
# Initial setup script for Makana development

set -e

echo "🌱 Setting up Makana development environment"
echo "============================================"
echo ""

# Check for Conda
if ! command -v conda &> /dev/null; then
    echo "❌ Conda not found. Please install Miniconda or Anaconda first."
    echo "   Visit: https://docs.conda.io/en/latest/miniconda.html"
    exit 1
fi

# Create Conda environment
echo "📦 Creating Conda environment..."
conda env create -f environment.yml

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Activate environment: conda activate makana"
echo "  2. Copy .env.example to .env and add your Supabase credentials"
echo "  3. Run: ./scripts/dev.sh"
echo ""
