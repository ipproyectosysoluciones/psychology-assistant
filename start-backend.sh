#!/bin/bash

# Script para iniciar el servidor backend de Node.js
cd /media/bladimir/Datos1/Datos/Node/psychology-assistant

echo "=== Psychology Assistant - Backend API Server ==="
echo "Iniciando servidor en puerto 5000..."
echo "URL: http://localhost:5000"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

# Ejecutar con nodemon para desarrollo
npx nodemon src/server.js

