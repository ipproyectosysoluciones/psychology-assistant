#!/bin/bash

# Backend API Verification Script
# Psychology Assistant - Systematic Endpoint Testing
# Created: March 11, 2026

echo "================================"
echo "Backend API Verification Script"
echo "================================"
echo ""

API_BASE="http://localhost:5000/api"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0

# Function to log test results
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_code=$4
    local description=$5
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    echo -e "${BLUE}[Test $TESTS_TOTAL]${NC} $description"
    echo "  $method $endpoint"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" == "$expected_code" ]; then
        echo -e "  ${GREEN}✓ Status: $http_code${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "  ${RED}✗ Status: $http_code (expected: $expected_code)${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    
    # Show response preview
    echo "  Response: $(echo "$body" | head -c 100)..."
    echo ""
}

echo -e "${YELLOW}Phase 1: Server Health Check${NC}"
echo "=============================="
test_endpoint "GET" "/health" "" "200" "Health endpoint check"

echo -e "${YELLOW}Phase 2: Authentication Endpoints${NC}"
echo "===================================="

# Test registration
echo "Testing registration..."
REGISTER_DATA='{"name":"Test User","email":"test'$RANDOM'@example.com","password":"SecurePass@2024","role":"psychologist"}'
test_endpoint "POST" "/auth/register" "$REGISTER_DATA" "201" "Register new user"

# Extract email from registration
TEST_EMAIL="test$RANDOM@example.com"
REGISTER_DATA='{"name":"Test Login User","email":"'$TEST_EMAIL'","password":"SecurePass@2024","role":"psychologist"}'
test_endpoint "POST" "/auth/register" "$REGISTER_DATA" "201" "Register user for login test"

# Test login
LOGIN_DATA='{"email":"'$TEST_EMAIL'","password":"SecurePass@2024"}'
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA")
LOGIN_CODE=$(curl -s -w "%{http_code}" -o /dev/null -X POST "$API_BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA")

echo -e "${BLUE}[Test $((TESTS_TOTAL+1))]${NC} Login with valid credentials"
echo "  POST /auth/login"
if [ "$LOGIN_CODE" == "200" ]; then
    echo -e "  ${GREEN}✓ Status: $LOGIN_CODE${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    # Extract token from login response
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken // empty')
    if [ -n "$ACCESS_TOKEN" ]; then
        echo -e "  ${GREEN}✓ Access token received${NC}"
    else
        echo -e "  ${RED}✗ No access token in response${NC}"
    fi
else
    echo -e "  ${RED}✗ Status: $LOGIN_CODE (expected 200)${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_TOTAL=$((TESTS_TOTAL + 1))
echo ""

echo -e "${YELLOW}Phase 3: User Endpoints (Requires Authentication)${NC}"
echo "===================================================="

if [ -n "$ACCESS_TOKEN" ]; then
    # Use curl with Bearer token
    echo "Testing authenticated endpoints with token..."
    
    # Get profile
    PROFILE_CODE=$(curl -s -w "%{http_code}" -o /dev/null -X GET "$API_BASE/users/profile" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json")
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -e "${BLUE}[Test $TESTS_TOTAL]${NC} Get user profile (authenticated)"
    echo "  GET /users/profile"
    if [ "$PROFILE_CODE" == "200" ]; then
        echo -e "  ${GREEN}✓ Status: $PROFILE_CODE${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "  ${RED}✗ Status: $PROFILE_CODE (expected 200)${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    echo ""
    
    # Get stats
    STATS_CODE=$(curl -s -w "%{http_code}" -o /dev/null -X GET "$API_BASE/users/stats" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json")
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -e "${BLUE}[Test $TESTS_TOTAL]${NC} Get user statistics"
    echo "  GET /users/stats"
    if [ "$STATS_CODE" == "200" ]; then
        echo -e "  ${GREEN}✓ Status: $STATS_CODE${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "  ${RED}✗ Status: $STATS_CODE (expected 200)${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    echo ""
else
    echo -e "${RED}Unable to obtain access token - skipping authenticated tests${NC}"
fi

echo -e "${YELLOW}Phase 4: CORS Headers Verification${NC}"
echo "====================================="

CORS_CHECK=$(curl -s -i -X OPTIONS "$API_BASE/appointments" \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: GET" 2>&1 | grep -i "Access-Control-Allow-Origin")

TESTS_TOTAL=$((TESTS_TOTAL + 1))
echo -e "${BLUE}[Test $TESTS_TOTAL]${NC} CORS headers present"
if [[ "$CORS_CHECK" == *"http://localhost:3000"* ]]; then
    echo -e "  ${GREEN}✓ CORS properly configured${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "  ${RED}✗ CORS might not be configured${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

echo -e "${YELLOW}Test Summary${NC}"
echo "=============="
echo "Total Tests: $TESTS_TOTAL"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
PASS_RATE=$((TESTS_PASSED * 100 / TESTS_TOTAL))
echo "Pass Rate: $PASS_RATE%"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
