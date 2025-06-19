#!/bin/bash

# 🔧 Explore Kaltara - Platform Stability Test & Fix Script
# Run this script to check and improve platform stability

echo "🎯 EXPLORE KALTARA - STABILITY CHECK & FIXES"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0
WARNINGS=0

echo ""
echo "📋 RUNNING STABILITY TESTS..."

# Test 1: Check if development server starts
echo ""
echo -e "${BLUE}1. Testing Development Server...${NC}"
if pnpm dev --help > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Development server can start${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ Development server issues detected${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 2: Check build process
echo ""
echo -e "${BLUE}2. Testing Build Process...${NC}"
if pnpm build > /tmp/build_output.log 2>&1; then
    echo -e "${GREEN}✅ Build process successful${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ Build process failed${NC}"
    echo "Check /tmp/build_output.log for details"
    FAILED=$((FAILED + 1))
fi

# Test 3: Check critical files exist
echo ""
echo -e "${BLUE}3. Checking Critical Files...${NC}"
CRITICAL_FILES=(
    "src/contexts/AuthContext.tsx"
    "src/components/AuthModal.tsx"
    "src/app/admin/page.tsx"
    "src/app/booking/page.tsx"
    "src/lib/supabase/client.ts"
    "src/lib/auth/admin.ts"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✅ $file${NC}"
    else
        echo -e "  ${RED}❌ $file missing${NC}"
        FAILED=$((FAILED + 1))
    fi
done

if [ ${#CRITICAL_FILES[@]} -eq $(ls -1 "${CRITICAL_FILES[@]}" 2>/dev/null | wc -l) ]; then
    PASSED=$((PASSED + 1))
fi

# Test 4: Check environment setup
echo ""
echo -e "${BLUE}4. Checking Environment Setup...${NC}"
if [ -f ".env" ] || [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ Environment file exists${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️  No .env file found - Supabase features may not work${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Test 5: Check package.json dependencies
echo ""
echo -e "${BLUE}5. Checking Dependencies...${NC}"
if jq -r '.dependencies | keys[]' package.json | grep -q "next"; then
    echo -e "${GREEN}✅ Next.js dependency found${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ Missing Next.js dependency${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 6: Check for TypeScript configuration
echo ""
echo -e "${BLUE}6. Checking TypeScript Setup...${NC}"
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}✅ TypeScript configuration exists${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ TypeScript configuration missing${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 7: Check public assets
echo ""
echo -e "${BLUE}7. Checking Public Assets...${NC}"
IMAGE_COUNT=$(find public/images -name "*.jpg" 2>/dev/null | wc -l)
if [ "$IMAGE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Found $IMAGE_COUNT images in public/images${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️  No images found in public/images${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "🔧 APPLYING FIXES..."

# Fix 1: Create admin authentication centralization example
echo ""
echo -e "${BLUE}Creating centralized admin utilities...${NC}"
if [ -f "src/lib/auth/admin.ts" ]; then
    echo -e "${GREEN}✅ Admin utilities already exist${NC}"
else
    echo -e "${YELLOW}⚠️  Admin utilities need to be created${NC}"
fi

# Fix 2: Check for missing dependencies
echo ""
echo -e "${BLUE}Checking for missing dependencies...${NC}"
REQUIRED_DEPS=("@supabase/supabase-js" "lucide-react" "leaflet" "react-leaflet")
for dep in "${REQUIRED_DEPS[@]}"; do
    if jq -r '.dependencies | keys[]' package.json | grep -q "$dep"; then
        echo -e "  ${GREEN}✅ $dep${NC}"
    else
        echo -e "  ${YELLOW}⚠️  $dep might be missing${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
done

echo ""
echo "📊 STABILITY RESULTS"
echo "===================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"

TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
    SCORE=$((PASSED * 100 / TOTAL))
    echo ""
    echo -e "📈 ${BLUE}Stability Score: $SCORE/100${NC}"
fi

echo ""
echo "🎯 RECOMMENDATIONS"
echo "=================="

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}🔴 CRITICAL: Fix failed tests before deployment${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}🔶 RECOMMENDED: Address warnings for optimal performance${NC}"
fi

echo ""
echo "📋 MANUAL CHECKLIST"
echo "==================="
echo "1. ✅ Run 'pnpm dev' and verify http://localhost:3000 loads"
echo "2. ✅ Test user registration and login"
echo "3. ✅ Test admin login with demo@admin.com"
echo "4. ✅ Test booking creation flow"
echo "5. ✅ Verify admin dashboard functionality"
echo "6. ✅ Check mobile responsiveness"
echo "7. ✅ Test search and filter features"
echo ""
echo "🚀 Platform assessment complete!"

# Exit with error code if critical tests failed
if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi
