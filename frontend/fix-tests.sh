#!/bin/bash
# 🧪 Script para corregir todos los archivos spec.ts
# ES: Automatizar la corrección de tests
# EN: Automate test fixes

echo "🔧 Iniciando corrección de tests..."

cd "$(dirname "$0")"

# 1. Corregir importaciones de test-fixtures
echo "1. Agregando imports de test-fixtures..."

for file in src/app/auth/*/**.spec.ts src/app/appointments/*/**.spec.ts src/app/services/user.spec.ts src/app/users/**/**.spec.ts; do
  if [ -f "$file" ]; then
    # Agregar import de test-fixtures si no existe
    if ! grep -q "test-fixtures" "$file"; then
      sed -i "/^import.*models/a import { createMockApiResponse, createMockUser, createMockAuthResponse } from '../../test-fixtures';" "$file"
    fi
  fi
done

# 2. Corregir names de componentes en tests
echo "2. Corrigiendo nombres de componentes..."
sed -i 's/imports: \[Dashboard\]/imports: [DashboardComponent]/g' src/app/dashboard/dashboard.spec.ts 2>/dev/null
sed -i 's/createComponent(Dashboard)/createComponent(DashboardComponent)/g' src/app/dashboard/dashboard.spec.ts 2>/dev/null

sed -i 's/imports: \[AppointmentDetail\]/imports: [AppointmentDetailComponent]/g' src/app/appointments/appointment-detail/appointment-detail.spec.ts 2>/dev/null
sed -i 's/createComponent(AppointmentDetail)/createComponent(AppointmentDetailComponent)/g' src/app/appointments/appointment-detail/appointment-detail.spec.ts 2>/dev/null

# 3. Ejecutar linter auto-fix
echo "3. Ejecutando auto-fix...de linter..."
pnpm lint --fix 2>/dev/null || true

echo "✅ Correcciones aplicadas. Ejecutar: pnpm test"
