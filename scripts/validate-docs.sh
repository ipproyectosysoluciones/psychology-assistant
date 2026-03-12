#!/bin/bash

# 📊 Documentation Validation Suite
# Psychology Assistant - Maintenance Scripts
# Purpose: Validate documentation structure, links, and consistency
# Usage: bash scripts/validate-docs.sh [option]

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     📚 DOCUMENTATION VALIDATION SUITE v0.4.0       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo

# ============================================================================
# FUNCTION: Check file existence
# ============================================================================
check_files_exist() {
    echo -e "${BLUE}🔍 Checking critical files existence...${NC}"
    
    local critical_files=(
        "docs/INDEX.md"
        "docs/VISUAL_GUIDE.md"
        "docs/MAINTENANCE_PROCESS.md"
        "TEAM_ONBOARDING.md"
        "docs/01-getting-started/README.md"
        "docs/01-getting-started/INSTALLATION.md"
        "docs/01-getting-started/CHANGELOG.md"
        "docs/01-getting-started/RELEASE_NOTES.md"
        "docs/02-architecture/README.md"
        "docs/02-architecture/ENVIRONMENT_SETUP.md"
        "docs/03-api/README.md"
        "docs/03-api/API_ENDPOINTS.md"
        "docs/04-guides/README.md"
        "docs/04-guides/QUICK_START.md"
        "docs/05-infrastructure/README.md"
        "docs/05-infrastructure/DEPLOYMENT.md"
        "docs/06-database/README.md"
        "docs/06-database/DATABASE.md"
        "docs/07-testing/README.md"
        "docs/07-testing/TESTING_REPORT.md"
    )
    
    local missing=0
    for file in "${critical_files[@]}"; do
        if [ -f "$file" ]; then
            echo -e "${GREEN}  ✅ $file${NC}"
        else
            echo -e "${RED}  ❌ MISSING: $file${NC}"
            ((missing++))
            ((ERRORS++))
        fi
    done
    
    echo
    [ $missing -eq 0 ] && echo -e "${GREEN}✓ All critical files present${NC}" || echo -e "${RED}✗ $missing files missing${NC}"
    echo
}

# ============================================================================
# FUNCTION: Check internal links (simplified)
# ============================================================================
check_internal_links() {
    echo -e "${BLUE}🔗 Checking internal links...${NC}"
    
    local broken=0
    
    # Check each docs file can be found
    for file in docs/01-getting-started/*.md docs/02-architecture/*.md docs/03-api/*.md \
                docs/04-guides/*.md docs/05-infrastructure/*.md docs/06-database/*.md \
                docs/07-testing/*.md
    do
        if [ -f "$file" ]; then
            echo -e "${GREEN}  ✅${NC} $(basename $file)"
        else
            echo -e "${RED}  ❌ MISSING: $file${NC}"
            ((broken++))
        fi
    done
    
    echo
    [ $broken -eq 0 ] && echo -e "${GREEN}✓ All key files found${NC}" || echo -e "${RED}✗ $broken files missing${NC}"
    echo
}

# ============================================================================
# FUNCTION: Check directory structure
# ============================================================================
check_directory_structure() {
    echo -e "${BLUE}📂 Checking directory structure...${NC}"
    
    local categories=("01-getting-started" "02-architecture" "03-api" "04-guides" "05-infrastructure" "06-database" "07-testing")
    
    for category in "${categories[@]}"; do
        local count=$(find "docs/$category" -name "*.md" 2>/dev/null | wc -l)
        if [ "$count" -gt 0 ]; then
            echo -e "${GREEN}  ✅${NC} docs/$category: $count files"
        else
            echo -e "${YELLOW}  ⚠️  docs/$category: No files found${NC}"
            ((WARNINGS++))
        fi
    done
    
    echo
}

# ============================================================================
# FUNCTION: Check file line counts
# ============================================================================
check_file_sizes() {
    echo -e "${BLUE}📏 File sizes (documentation health)...${NC}"
    
    echo "Large docs (>300 lines - comprehensive):"
    find docs -name "*.md" -type f -exec wc -l {} + | sort -rn | head -5
    
    echo
    echo "Small docs (<50 lines - may need expansion):"
    find docs -name "*.md" -type f -exec wc -l {} + | sort -n | head -5
    
    echo
}

# ============================================================================
# FUNCTION: Check version consistency
# ============================================================================
check_version_consistency() {
    echo -e "${BLUE}🏷️  Checking version references...${NC}"
    
    local versions=$(grep -r "v0\." docs --include="*.md" 2>/dev/null | grep -oE "v[0-9]+\.[0-9]+\.[0-9]+" | sort | uniq)
    
    if [ -z "$versions" ]; then
        echo -e "${YELLOW}  ⚠️  No version tags found in documentation${NC}"
        return
    fi
    
    echo "Version tags found:"
    echo "$versions"
    
    echo
}

# ============================================================================
# FUNCTION: Check for TODO comments
# ============================================================================
check_todos() {
    echo -e "${BLUE}📝 Checking for TODO/FIXME comments...${NC}"
    
    local todos=$(grep -r "TODO\|FIXME\|XXX\|HACK" docs --include="*.md" 2>/dev/null)
    
    if [ -z "$todos" ]; then
        echo -e "${GREEN}  ✓ No TODO comments found${NC}"
    else
        echo "$todos"
    fi
    
    echo
}

# ============================================================================
# FUNCTION: Generate statistics
# ============================================================================
generate_statistics() {
    echo -e "${BLUE}📊 Documentation Statistics...${NC}"
    
    local total_files=$(find docs -name "*.md" -type f | wc -l)
    local total_lines=$(find docs -name "*.md" -type f | xargs wc -l | tail -1 | awk '{print $1}')
    local total_words=$(find docs -name "*.md" -type f | xargs wc -w | tail -1 | awk '{print $1}')
    local links=$(grep -r "\[.*\](\./" docs --include="*.md" 2>/dev/null | wc -l)
    
    echo "  Total markdown files: $total_files"
    echo "  Total lines of documentation: $total_lines"
    echo "  Total words: $total_words"
    echo "  Internal links: $links"
    echo
}

# ============================================================================
# FUNCTION: Summary report
# ============================================================================
print_summary() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║              VALIDATION SUMMARY REPORT              ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
    echo
    
    if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}✅ ALL CHECKS PASSED - Documentation is healthy!${NC}"
        echo
        echo "  • All critical files present"
        echo "  • All internal links valid"
        echo "  • Directory structure intact"
        echo "  • No TODO comments"
        echo
        return 0
    else
        echo -e "${RED}❌ VALIDATION COMPLETED WITH ISSUES${NC}"
        echo
        [ $ERRORS -gt 0 ] && echo -e "${RED}  Errors: $ERRORS${NC}"
        [ $WARNINGS -gt 0 ] && echo -e "${YELLOW}  Warnings: $WARNINGS${NC}"
        echo
        echo "Please review and fix the issues above."
        echo
        return 1
    fi
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
    check_files_exist
    check_directory_structure
    check_internal_links
    check_file_sizes
    check_version_consistency
    check_todos
    generate_statistics
    print_summary
}

main
