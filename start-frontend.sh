#!/bin/bash

# Script para iniciar el servidor frontend de Angular
cd /media/bladimir/Datos1/Datos/Node/psychology-assistant/frontend

echo "=== Psychology Assistant - Frontend Dev Server ==="
echo "Iniciando servidor en puerto 4200..."
echo "URL: http://localhost:4200"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

# Ejecutar ng serve con configuraciones específicas
npx ng serve \
  --port 4200 \
  --host 0.0.0.0 \
  --disable-host-check \
  --configuration development \
  --poll 2000 \
  --watch=true

