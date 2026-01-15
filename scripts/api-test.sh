#!/bin/bash
# Manual API testing helper

API_URL="http://localhost:8000"

echo "🔧 Makana API Testing Helper"
echo "============================"
echo ""
echo "API: $API_URL"
echo "Docs: $API_URL/docs"
echo ""

# Check if API is running
if ! curl -s "$API_URL/health" > /dev/null; then
    echo "❌ API is not running. Start it with: ./scripts/dev.sh"
    exit 1
fi

echo "✅ API is running"
echo ""
echo "Quick test commands:"
echo ""
echo "# Sign up"
echo "curl -X POST $API_URL/api/v1/auth/signup \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'"
echo ""
echo "# Sign in (save token)"
echo "TOKEN=\$(curl -X POST $API_URL/api/v1/auth/signin \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}' \\"
echo "  | jq -r '.access_token')"
echo ""
echo "# Create daily check"
echo "curl -X POST $API_URL/api/v1/daily-check \\"
echo "  -H \"Authorization: Bearer \$TOKEN\" \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"responses\":{\"energy\":\"medium\"}}'"
echo ""
echo "# Start session"
echo "curl -X POST $API_URL/api/v1/sessions \\"
echo "  -H \"Authorization: Bearer \$TOKEN\" \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"setup_id\":\"00000000-0000-0000-0000-000000000001\"}'"
echo ""
echo "For interactive testing, visit: $API_URL/docs"
echo ""
