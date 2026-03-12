#!/bin/bash

################################################################################
# Install Cron Job for Documentation Validation (macOS/Linux)
# 
# Este script configura un cron job que ejecuta validación cada 2 días a las 14:00
#
# Uso: bash scripts/install-cron-validation.sh
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_PATH="${PROJECT_ROOT}/scripts/validate-and-report.sh"

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  📅 INSTALADOR DE CRON VALIDATION v0.4.0          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if script exists
if [ ! -f "$SCRIPT_PATH" ]; then
    echo -e "${RED}❌ Error: Script no encontrado en ${SCRIPT_PATH}${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Información del cron:${NC}"
echo "  • Frecuencia: Cada 2 días"
echo "  • Hora: 14:00 (2:00 PM)"
echo "  • Script: $SCRIPT_PATH"
echo "  • Reporte: ${PROJECT_ROOT}/docs/validation-reports/"
echo ""

# Check if cron job already exists
CRON_ENTRY="0 14 */2 * * bash ${SCRIPT_PATH}"

if crontab -l 2>/dev/null | grep -q "validate-and-report.sh"; then
    echo -e "${YELLOW}⚠️  Ya existe un cron job similar.${NC}"
    echo ""
    echo -e "${BLUE}Cron jobs actuales:${NC}"
    crontab -l 2>/dev/null | grep -i "validation\|validate-docs" || echo "  (ninguno encontrado)"
    echo ""
    
    read -p "¿Deseas reemplazarlo? (s/n) " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Se canceló la instalación."
        exit 0
    fi
    
    # Remove old entry
    (crontab -l 2>/dev/null | grep -v "validate-and-report.sh" | crontab -) 2>/dev/null || true
fi

# Create temporary crontab with new entry
(crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -

echo -e "${GREEN}✅ Cron job instalado exitosamente${NC}"
echo ""
echo -e "${BLUE}📋 Detalles del cron:${NC}"
crontab -l 2>/dev/null | grep -E "validate-and-report|# Validation"

echo ""
echo -e "${BLUE}═════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Próximas ejecuciones:${NC}"
echo ""

# Calculate next execution dates
echo "  Las validaciones se ejecutarán en:"

CURRENT_DATE=$(date +%Y-%m-%d)
CURRENT_HOUR=$(date +%H)

if [ "$CURRENT_HOUR" -lt 14 ]; then
    NEXT_RUN=$(date -v+0d +%Y-%m-%d)
else
    # Calculate in 2 days
    NEXT_RUN=$(date -d "+2 days" +%Y-%m-%d 2>/dev/null || date -v+2d +%Y-%m-%d)
fi

echo "    • Próxima ejecución: ${NEXT_RUN} a las 14:00"
echo "    • Y luego cada 2 días"
echo ""

echo -e "${BLUE}═════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📝 Notas importantes:${NC}"
echo ""
echo "  1️⃣  Los reportes se guardan en:"
echo "      ${PROJECT_ROOT}/docs/validation-reports/"
echo ""
echo "  2️⃣  Para ver próximas ejecuciones:"
echo "      crontab -l"
echo ""
echo "  3️⃣  Para editar el cron:"
echo "      crontab -e"
echo ""
echo "  4️⃣  Para eliminar el cron:"
echo "      crontab -r"
echo ""
echo "  5️⃣  Para ver logs del cron:"
echo "      log stream --predicate 'eventMessage contains[c] \"cron\"' --level debug"
echo ""
echo -e "${BLUE}═════════════════════════════════════════════════════${NC}"
echo ""

# Test the script
echo -e "${YELLOW}🧪 Probando el script...${NC}"

if bash "$SCRIPT_PATH" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Script ejecutado correctamente${NC}"
else
    echo -e "${RED}⚠️  Error en la ejecución del script${NC}"
    echo -e "${YELLOW}   Pero el cron ha sido instalado.${NC}"
    echo -e "${YELLOW}   Revisa: ${PROJECT_ROOT}/docs/validation-reports/${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Instalación completada!${NC}"
echo ""

# Show summary
echo -e "${BLUE}📊 Resumen:${NC}"
echo "  • Sistema: $(uname -s)"
echo "  • Cron instalado: ✅"
echo "  • Próxima ejecución: Automática cada 2 días a las 14:00"
echo "  • Reportes: Se guardarán en docs/validation-reports/"
echo ""
echo -e "${YELLOW}Tip: Los reportes se pueden revisar en el repositorio bajo docs/validation-reports/${NC}"
echo ""
