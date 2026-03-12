#!/bin/bash

################################################################################
# Documentation Validation & Reporting Script
# Ejecuta validación cada 2 días y genera reportes con notificaciones
# 
# Uso: bash scripts/validate-and-report.sh
# Cron: 0 14 */2 * * bash /ruta/al/proyecto/scripts/validate-and-report.sh
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPORTS_DIR="${PROJECT_ROOT}/docs/validation-reports"
TIMESTAMP=$(date "+%Y%m%d_%H%M%S")
REPORT_FILE="${REPORTS_DIR}/validation_${TIMESTAMP}.log"
OWNER_EMAIL="ipproyectossoluciones@gmail.com"
REPO_URL="https://github.com/ipproyectosysoluciones/psychology-assistant"

# Create reports directory if it doesn't exist
mkdir -p "${REPORTS_DIR}"

# Function: Print with timestamp
log_message() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "${REPORT_FILE}"
}

# Function: Determine severity level
get_severity_level() {
    local check_name="$1"
    local has_error="$2"
    
    if [ "$has_error" = "true" ]; then
        case "$check_name" in
            "critical_files"|"bilingual"|"links")
                echo "CRÍTICO"
                ;;
            "structure"|"versions")
                echo "ALTO"
                ;;
            *)
                echo "MEDIO"
                ;;
        esac
    else
        echo "OK"
    fi
}

# Function: Create GitHub issue
create_github_issue() {
    local severity="$1"
    local report_file="$2"
    local priority_label=""
    
    case "$severity" in
        "CRÍTICO")
            priority_label="🔴-critico"
            ;;
        "ALTO")
            priority_label="🟠-alto"
            ;;
        "MEDIO")
            priority_label="🟡-medio"
            ;;
    esac
    
    # Check if running in GitHub Actions
    if [ -n "$GITHUB_TOKEN" ] && [ -n "$GITHUB_REPOSITORY" ]; then
        local issue_title="[AUTO] Validación de Documentación Falló - $severity"
        local issue_body=$(cat "${report_file}" | head -100)
        
        # Create issue using GitHub CLI (if available) or API
        if command -v gh &> /dev/null; then
            gh issue create \
                --title "${issue_title}" \
                --body "Reporte de validación:\n\`\`\`\n${issue_body}\n\`\`\`" \
                --label "documentation,${priority_label}"
        fi
    fi
}

# Function: Send email notification (mockup - needs manual setup)
send_email_notification() {
    local severity="$1"
    local report_summary="$2"
    
    log_message "${YELLOW}📧 Email notification would be sent to: ${OWNER_EMAIL}${NC}"
    log_message "${YELLOW}   Severity: ${severity}${NC}"
    log_message "${YELLOW}   Report: ${REPORT_FILE}${NC}"
    
    # Note: Email sending requires mail/sendmail configuration
    # This is a placeholder for documentation of the process
}

# Start validation
echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  📚 VALIDACIÓN DE DOCUMENTACIÓN & REPORT v0.4.0   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

log_message "${BLUE}Iniciando validación de documentación...${NC}"
log_message "Timestamp: ${TIMESTAMP}"
log_message "Directorio: ${PROJECT_ROOT}"
echo ""

# Run main validation script
cd "${PROJECT_ROOT}"
bash scripts/validate-docs.sh 2>&1 | tee -a "${REPORT_FILE}"

VALIDATION_EXIT_CODE=$?

echo ""
log_message "${BLUE}═════════════════════════════════════════════════════${NC}"

# Analyze results
if [ $VALIDATION_EXIT_CODE -eq 0 ]; then
    log_message "${GREEN}✅ VALIDACIÓN EXITOSA${NC}"
    log_message "Todas las verificaciones pasaron correctamente."
    
    # Add summary
    echo "" >> "${REPORT_FILE}"
    echo "═════════════════════════════════════════════════════" >> "${REPORT_FILE}"
    echo "RESULTADO FINAL: ✅ SUCCESS" >> "${REPORT_FILE}"
    echo "Fecha: $(date '+%Y-%m-%d %H:%M:%S')" >> "${REPORT_FILE}"
    echo "═════════════════════════════════════════════════════" >> "${REPORT_FILE}"
else
    log_message "${RED}❌ VALIDACIÓN FALLÓ${NC}"
    log_message "Hay problemas que requieren atención."
    
    # Determine severity
    SEVERITY=$(get_severity_level "validation_failure" "true")
    
    # Add summary
    echo "" >> "${REPORT_FILE}"
    echo "═════════════════════════════════════════════════════" >> "${REPORT_FILE}"
    echo "RESULTADO FINAL: ❌ FAILED" >> "${REPORT_FILE}"
    echo "Severidad: ${SEVERITY}" >> "${REPORT_FILE}"
    echo "Fecha: $(date '+%Y-%m-%d %H:%M:%S')" >> "${REPORT_FILE}"
    echo "═════════════════════════════════════════════════════" >> "${REPORT_FILE}"
    
    # Notify about failure
    log_message ""
    log_message "${RED}🚨 NOTIFICACIONES:${NC}"
    
    # Create GitHub issue
    if [ -n "$GITHUB_TOKEN" ]; then
        log_message "${YELLOW}→ Creando issue automático en GitHub...${NC}"
        create_github_issue "$SEVERITY" "$REPORT_FILE"
    fi
    
    # Send email notification
    log_message "${YELLOW}→ Preparando notificación por email...${NC}"
    send_email_notification "$SEVERITY" "$REPORT_FILE"
fi

echo ""
log_message "${BLUE}═════════════════════════════════════════════════════${NC}"
log_message "${BLUE}📊 Reporte guardado en: ${REPORT_FILE}${NC}"
log_message "${BLUE}═════════════════════════════════════════════════════${NC}"

# Keep last 30 reports, delete older ones
log_message "🧹 Limpiando reportes antiguos (manteniendo últimos 30 días)..."
find "${REPORTS_DIR}" -name "validation_*.log" -mtime +30 -delete

# List recent reports
log_message ""
log_message "${BLUE}📁 Últimos 5 reportes:${NC}"
ls -lt "${REPORTS_DIR}"/validation_*.log 2>/dev/null | head -5 | awk '{print "  " $9}' | tee -a "${REPORT_FILE}"

echo ""
echo -e "${BLUE}Validación completada.${NC}"
exit $VALIDATION_EXIT_CODE
