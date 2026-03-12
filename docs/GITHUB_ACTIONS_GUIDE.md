# 🚀 GitHub Actions - Validación Automática de Documentación

**Psychology Assistant | v0.4.0** | Guía Completa de GitHub Actions para Validación de Documentación

---

## 🇬🇧 English

### Overview

GitHub Actions automatically validates your documentation **every 2 days at 14:00 UTC**. No manual setup required—it's already active!

```
 Current Status: ✅ ACTIVE
   Workflow: validate-docs-scheduled.yml
   Schedule: Every 2 days at 14:00 UTC
   Auto-execution: Yes (cloud-based)
   Notifications: GitHub Issues + Email
```

---

## ✅ What's Already Setup

### 1. **Workflow File** ✅
- **Location**: `.github/workflows/validate-docs-scheduled.yml`
- **Status**: Active and configured
- **Triggers**: 
  - ⏰ Schedule: Every 2 days at 14:00 UTC
  - 🎯 Manual: Can trigger manually from Actions tab

### 2. **Validation Scripts** ✅
- **Main Script**: `scripts/validate-and-report.sh`
- **Base Script**: `scripts/validate-docs.sh`
- **Status**: Executed automatically by workflow

### 3. **Notifications** ✅
- **On Success**: Silent (no issues created)
- **On Failure**: 
  - GitHub Issue created with severity labels
  - Email to: `ipproyectossoluciones@gmail.com`

### 4. **Reports** ✅
- **Storage**: GitHub Actions Artifacts
- **Location**: Each run's artifacts section
- **Retention**: 30 days
- **Also saved**: `docs/validation-reports/` (if local run)

---

## 🔍 How to Monitor Executions

### Method 1: GitHub Web Interface

1. **Go to your repository**:
   - URL: `https://github.com/ipproyectosysoluciones/psychology-assistant`

2. **Click the "Actions" tab**
   
3. **Find the workflow**:
   - Name: `📚 Validación Programada de Documentación`
   
4. **View execution details**:
   - ✅ **Success**: Green checkmark, "All checks passed"
   - ❌ **Failed**: Red X, error message shown

5. **Download reports**:
   - Click on any run
   - Scroll down to "Artifacts"
   - Download `validation-report-XXXXX`

### Method 2: GitHub CLI

```bash
# Install GitHub CLI if you don't have it
# Then use these commands:

# List recent workflow runs
gh run list --workflow validate-docs-scheduled.yml --limit 5

# View details of specific run
gh run view RUN_ID

# Download artifacts from latest run
gh run download -n validation-report
```

### Method 3: Monitor Automatically

**Setup GitHub notifications**:
1. Go to GitHub Settings → Notifications
2. Subscribe to: `Repository › Workflow runs`
3. You'll get email notifications on failures

---

## 📊 Understanding the Workflow

### What Happens During Execution:

```
START (Every 2 days at 14:00 UTC)
  │
  ├─→ 📥 Clone repository
  ├─→ 📦 Install Node.js 20.x
  ├─→ 📚 Run validation script
  │    └─→ Checks: Files, Structure, Links, Versions, Bilingual, TODOs
  │
  ├─→ 📊 Upload report as artifact (always)
  ├─→ 🔍 Display results
  │
  └─→ If FAILED:
       ├─→ 🚀 Create GitHub Issue (with severity level)
       └─→ 📧 Send email notification
       
COMPLETE
```

### Exit Codes:
- **0** (Success): All checks passed ✅
- **1** (Failure): One or more checks failed ❌

---

## 🎯 Trigger a Manual Run

**Run validation on-demand** (don't wait 2 days):

1. Go to: **Actions** tab
2. Select: **`📚 Validación Programada de Documentación`**
3. Click: **`Run workflow`** button
4. Branch: **`main`** (should be default)
5. Click: **`Run workflow`**

**Execution starts immediately!**

---

## 📋 Issue Creation Details

When validation fails, GitHub automatically creates an issue:

### Issue Format:
```
Title: [AUTO] ⚠️ [SEVERITY] - Validación de Documentación Falló

Labels (auto-assigned):
  🔴 🔴-critico      (Critical problems)
  🟠 🟠-alto         (High priority)
  🟡 🟡-medio        (Medium priority)
  documentation     (Always)

Body includes:
  • Validation report (first 2000 chars)
  • Link to full artifact
  • Timestamp
  • Links to relevant docs
```

### Severity Logic:
```
Critical issues (any):
  • Bilingual markers missing
  • Critical files missing
  • Internal links broken

High priority:
  • Structure problems
  • Version inconsistencies

Medium priority:
  • Other validation failures
```

---

## 📧 Email Notifications

### When sent:
- ❌ **Always on failure** (if workflow fails)

### Email details:
- **To**: `ipproyectossoluciones@gmail.com`
- **Subject**: Workflow failure notification
- **Body**: Run ID, failure reason, link to GitHub

### Why no email on success?
- Too noisy to email every success
- Check GitHub Actions tab instead
- Issues track actual problems

---

## 🔐 Permissions Used

The workflow uses these GitHub permissions:
```yaml
permissions:
  contents: read      # Read repository contents
  issues: write       # Create issues on failure
```

**Note**: No modifications are made to your repository, only read + issue creation.

---

## 🧪 Troubleshooting

### Workflow not running on schedule

**Possible causes**:
- Repository might be archived or disabled
- Workflow file might have syntax errors
- Branch protection rules blocking

**Solution**:
```bash
# Verify workflow file syntax is valid
grep "^on:" .github/workflows/validate-docs-scheduled.yml

# Check if workflow is enabled in GitHub settings
# Settings → Actions → General → Workflow permissions
```

### Issues not being created

**Possible cause**: 
- `GITHUB_TOKEN` permissions insufficient

**Solution**:
1. Go to: **Settings** → **Actions** → **General**
2. Scroll to: **Workflow permissions**
3. Select: **Read and write permissions** ✅
4. Rerun: The workflow

### Artifacts not saving

**Possible cause**:
- Validation script didn't generate reports

**Solution**:
```bash
# Run validation locally first
bash scripts/validate-and-report.sh

# Verify reports exist
ls docs/validation-reports/
```

---

## 📊 Viewing Artifacts

### From GitHub Web:
1. Actions tab → Select a run
2. Scroll down to "Artifacts"
3. Download: `validation-report-XXXXX`

### Command line:
```bash
# List artifacts
gh run list --workflow validate-docs-scheduled.yml

# Download latest artifact
gh run download --repo owner/repo -n validation-report
```

### Artifact contents:
```
validation-reports/
├── validation_20260312_140000.log
├── validation_20260314_140000.log
└── validation_20260316_140000.log
```

---

## 📅 Schedule Reference

```
Cron format: 0 14 */2 * *

Execution dates:
  March 2026:
    12 (Wed), 14 (Fri), 16 (Sun), 18 (Tue), 20 (Thu)...
    (pattern repeats every 2 days)

Times (in different timezones):
  UTC:   14:00
  CEST:  16:00 (UTC+2)
  EST:   10:00 (UTC-4)
  PST:   07:00 (UTC-7)
```

---

## 🔗 Related Documentation

- [`VALIDATION_AUTOMATION.md`](./VALIDATION_AUTOMATION.md) - Complete setup guide
- [`MAINTENANCE_PROCESS.md`](./MAINTENANCE_PROCESS.md) - Maintenance schedule
- [`validate-docs-scheduled.yml`](../.github/workflows/validate-docs-scheduled.yml) - Workflow file
- [`scripts/validate-and-report.sh`](../scripts/validate-and-report.sh) - Validation script

---

## ✅ Quick Checklist

- [ ] Repository is public (or Actions are enabled)
- [ ] Workflow file exists: `.github/workflows/validate-docs-scheduled.yml` ✅
- [ ] Scripts exist and are executable ✅
- [ ] GitHub token permissions set to Read+Write
- [ ] Email is configured: `ipproyectossoluciones@gmail.com`
- [ ] Monitoring method chosen (web/CLI/email)

---

## 🇪🇸 Español

### Descripción General

GitHub Actions valida tu documentación **automáticamente cada 2 días a las 14:00 UTC**. ¡No requiere configuración manual, ya está activo!

```
Estado Actual: ✅ ACTIVO
   Workflow: validate-docs-scheduled.yml
   Horario: Cada 2 días a las 14:00 UTC
   Ejecución automática: Sí (basado en nube)
   Notificaciones: Issues de GitHub + Email
```

### ✅ Lo Que Ya Está Configurado

1. **Workflow**: `.github/workflows/validate-docs-scheduled.yml` ✅
2. **Scripts**: `scripts/validate-and-report.sh` ✅
3. **Notificaciones**: Issues automáticos + Email ✅
4. **Reportes**: Guardados en Artifacts (30 días) ✅

### 🔍 Cómo Monitorear

#### Opción 1: Web de GitHub
1. Abre: https://github.com/ipproyectosysoluciones/psychology-assistant
2. Click: Pestaña **Actions**
3. Busca: `📚 Validación Programada de Documentación`
4. Ver: Estado (✅ o ❌) y descargar reportes

#### Opción 2: GitHub CLI
```bash
# Listar ejecuciones recientes
gh run list --workflow validate-docs-scheduled.yml --limit 5

# Ver detalles
gh run view RUN_ID
```

#### Opción 3: Email
- Se notifica automáticamente cuando falla
- Email a: `ipproyectossoluciones@gmail.com`

### 🎯 Ejecutar Manualmente

**Para validar ahora (sin esperar 2 días)**:
1. Actions tab
2. Workflow: `📚 Validación Programada de Documentación`
3. Click: **Run workflow**
4. ¡Inicia inmediatamente!

### 📊 Cuando Falla

Se crea un issue automático en GitHub con:
- 🔴 Etiqueta de severidad (crítico/alto/medio)
- 📊 Reporte de validación
- 🔗 Enlaces a documentación relevante

---

**Last Updated**: March 12, 2026  
**Version**: v0.4.0  
**Status**: ✅ Production Ready

*Para preguntas: Ver [VALIDATION_AUTOMATION.md](./VALIDATION_AUTOMATION.md)*
