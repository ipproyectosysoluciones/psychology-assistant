# 📅 Validación Automática de Documentación

**Psychology Assistant | v0.4.0** | Configuración de cron local y GitHub Actions

---

## 🇬🇧 English

### Overview

The documentation validation now runs **automatically every 2 days at 14:00 UTC** via:
- ✅ **GitHub Actions** (cloud - always runs)
- ✅ **Local cron** (macOS/Linux - optional for development)

### Setup Instructions

#### Option A: GitHub Actions (Automatic)
GitHub Actions is automatically enabled. No additional setup needed.

**Execution**: Every 2 days at 14:00 UTC
**Location**: `.github/workflows/validate-docs-scheduled.yml`

#### Option B: Local Cron (macOS/Linux)

**Install cron job:**
```bash
bash scripts/install-cron-validation.sh
```

This will:
- ✅ Create cron entry
- ✅ Verify script works
- ✅ Show next execution dates
- ✅ Setup reporting directory

**Manual verification:**
```bash
# List cron jobs
crontab -l

# Edit cron jobs
crontab -e

# Remove cron job
crontab -r
```

#### Option C: Manual Execution

Run validation anytime:
```bash
bash scripts/validate-and-report.sh
```

### Reports

Reports are saved with timestamps:
```
docs/validation-reports/
├── validation_20260312_140000.log
├── validation_20260310_140000.log
└── validation_20260308_140000.log
```

### Notifications

**When validation fails:**

1. 🔴 **Critical issues**: GitHub issue created with `🔴-critico` label
2. 🟠 **High priority**: GitHub issue with `🟠-alto` label  
3. 🟡 **Medium priority**: GitHub issue with `🟡-medio` label
4. 📧 **Email**: Sent to `ipproyectossoluciones@gmail.com`

**GitHub Issues created include:**
- Full validation report (first 2000 chars)
- Link to complete artifact
- Severity level
- Auto-links to relevant docs

### Monitoring

**Check recent executions:**
```bash
# List reports
ls -lh docs/validation-reports/

# View latest report
tail -f docs/validation-reports/validation_*.log | tail -1

# GitHub Actions dashboard
# https://github.com/ipproyectosysoluciones/psychology-assistant/actions
```

---

## 🇪🇸 Español

### Descripción General

La validación de documentación se ejecuta **automáticamente cada 2 días a las 14:00 UTC** mediante:
- ✅ **GitHub Actions** (nube - siempre se ejecuta)
- ✅ **Cron local** (macOS/Linux - opcional para desarrollo)

### Instrucciones de Configuración

#### Opción A: GitHub Actions (Automático)
GitHub Actions está habilitado automáticamente. No se requiere configuración adicional.

**Ejecución**: Cada 2 días a las 14:00 UTC
**Ubicación**: `.github/workflows/validate-docs-scheduled.yml`

#### Opción B: Cron Local (macOS/Linux)

**Instalar cron job:**
```bash
bash scripts/install-cron-validation.sh
```

Esto hará:
- ✅ Crear entrada de cron
- ✅ Verificar que el script funcione
- ✅ Mostrar próximas fechas de ejecución
- ✅ Preparar directorio de reportes

**Verificación manual:**
```bash
# Listar trabajos cron
crontab -l

# Editar cron
crontab -e

# Eliminar cron
crontab -r
```

#### Opción C: Ejecución Manual

Ejecutar validación en cualquier momento:
```bash
bash scripts/validate-and-report.sh
```

### Reportes

Los reportes se guardan con timestamp:
```
docs/validation-reports/
├── validation_20260312_140000.log
├── validation_20260310_140000.log
└── validation_20260308_140000.log
```

### Notificaciones

**Cuando la validación falla:**

1. 🔴 **Problemas críticos**: Se crea issue en GitHub con etiqueta `🔴-critico`
2. 🟠 **Prioridad alta**: Issue con etiqueta `🟠-alto`
3. 🟡 **Prioridad media**: Issue con etiqueta `🟡-medio`
4. 📧 **Email**: Se envía a `ipproyectossoluciones@gmail.com`

**Los issues incluyen:**
- Reporte completo de validación (primeros 2000 chars)
- Enlace al artefacto completo
- Nivel de severidad
- Enlaces a documentación relevante

### Monitoreo

**Ver ejecuciones recientes:**
```bash
# Listar reportes
ls -lh docs/validation-reports/

# Ver último reporte
tail -f docs/validation-reports/validation_*.log | tail -1

# Dashboard de GitHub Actions
# https://github.com/ipproyectosysoluciones/psychology-assistant/actions
```

---

## 📋 Archivos Relacionados

| Archivo | Propósito |
| --- | --- |
| `scripts/validate-and-report.sh` | Script principal de validación y reportes |
| `scripts/install-cron-validation.sh` | Instalador del cron job local |
| `scripts/validate-docs.sh` | Script de validación base (core) |
| `.github/workflows/validate-docs-scheduled.yml` | GitHub Action workflow |
| `docs/validation-reports/` | Directorio de reportes generados |
| `MAINTENANCE_PROCESS.md` | Proceso de mantenimiento (incluye esto) |

---

## ⏰ Especificaciones de Tiempo

```
Cron Format: 0 14 */2 * *
│  │  │   │ │
│  │  │   │ └─── Día de la semana (0-6, 0=domingo)
│  │  │   └───── Mes (1-12)
│  │  └───────── Día del mes (*/2 = cada 2 días)
│  └───────────── Hora (14 = 2:00 PM)
└──────────────── Minuto (0)

Resultado:
← Cada 2 días a las 14:00 UTC (16:00 CEST, 10:00 EST)
```

---

## 🔧 Troubleshooting

### Cron no se ejecuta

```bash
# Verificar que cron está activo
crontab -l

# Ver logs de cron (macOS)
log stream --predicate 'eventMessage contains[c] "cron"'

# Ver logs de cron (Linux)
grep CRON /var/log/syslog
```

### Script no encontrado

```bash
# Verificar ruta correcta
ls -la scripts/validate-and-report.sh

# Asegurar que sea ejecutable
chmod +x scripts/validate-and-report.sh
```

### Permisos denegados

```bash
# Asegurar permisos en directorio de reportes
mkdir -p docs/validation-reports
chmod 755 docs/validation-reports
chmod +x scripts/validate-and-report.sh
```

---

## 📊 Métricas

| Métrica | Valor |
| --- | --- |
| Frecuencia | Cada 2 días |
| Hora | 14:00 UTC |
| Duración estimada | 20-45 segundos |
| Retención de reportes | 30 días |
| Notificaciones | Email + GitHub Issues |
| Severidades | 3 niveles (Crítico/Alto/Medio) |

---

## 🚀 Próximas Mejoras

- [ ] Slack integration para notificaciones
- [ ] Webhook para sistemas de monitoreo
- [ ] Dashboard visual de reportes
- [ ] Comparativas históricas de documentación
- [ ] Reportes en HTML con gráficos

---

**Last Updated**: March 12, 2026  
**Version**: v0.4.0  
**Status**: ✅ Production Ready
