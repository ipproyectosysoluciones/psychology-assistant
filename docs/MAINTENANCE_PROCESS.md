# 🛠️ Documentation Maintenance Process

**Psychology Assistant** | v0.4.0 | Maintenance Guide | 2026

---

## 📋 Overview

This document defines the **maintenance process** for keeping documentation accurate, up-to-date, and consistent across the 32-file documentation structure.

**Objetivo**: Ensure documentation stays synchronized with code changes, maintains consistency, and remains useful for all roles.

**Responsibles**:
- 👨‍💻 Backend/Frontend Developers: Update feature/API docs
- 🚀 DevOps: Update infrastructure/deployment docs
- 🏛️ Tech Lead/Architect: Review & approve changes
- 📊 Docs Maintainer: Coordinate updates & validation

---

## 🚨 When to Update Documentation

### Automatic Triggers

Update docs **immediately after** any of these events:

| Event | Docs to Update | Priority |
|-------|----------------|----------|
| 🆕 New API endpoint added | `03-api/API_ENDPOINTS.md` | 🔴 CRITICAL |
| 🐛 Breaking API change | `03-api/API_ENDPOINTS.md` + CHANGELOG | 🔴 CRITICAL |
| 🆕 New feature released | `01-getting-started/RELEASE_NOTES.md` | 🔴 CRITICAL |
| 🔧 Environment variable added | `02-architecture/ENVIRONMENT_SETUP.md` | 🟡 HIGH |
| ♻️ Architecture pattern change | `02-architecture/README.md` | 🟡 HIGH |
| 🐳 Docker config updated | `04-guides/DOCKER.md` + `05-infrastructure/DOCKER.md` | 🟡 HIGH |
| 🗄️ Database schema change | `06-database/DATABASE.md` | 🟡 HIGH |
| 📊 Test coverage changed | `07-testing/TESTING_REPORT.md` | 🟠 MEDIUM |
| 🚀 Deployment process change | `05-infrastructure/DEPLOYMENT.md` | 🟡 HIGH |
| 📖 New guide needed | Create in `04-guides/` | 🟠 MEDIUM |
| ✅ Version bump | `01-getting-started/CHANGELOG.md` + all version refs | 🔴 CRITICAL |

### Monthly Review Triggers

The **Docs Maintainer** should:
- [ ] Review all 32 files (2x per month)
- [ ] Check all 50+ internal links (validate monthly)
- [ ] Update statistics in TEAM_ONBOARDING.md
- [ ] Check for outdated screenshots/code examples
- [ ] Review recent commits that touched docs

### Quarterly Review

- [ ] Full audit of all categories
- [ ] Check external links still valid
- [ ] Review bilingual consistency (ES+EN)
- [ ] Update version badges if released
- [ ] Archive old release notes (keep 3 latest)

---

## 📝 Step-by-Step Update Process

### Step 1: Identify What Changed

```bash
# See what files changed in your branch
git diff main --name-only

# See which docs/ files were modified
git diff main --name-only docs/

# Check if docs need updates based on code changes
git diff main -- src/ | grep -E "function|export|schema"
```

### Step 2: Determine Affected Documentation

Use this table to find which docs to update:

```
Code Change Location    →    Documentation File to Update
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
src/controllers/        →    03-api/API_ENDPOINTS.md
src/models/            →    06-database/DATABASE.md
src/config/            →    02-architecture/ENVIRONMENT_SETUP.md
src/services/          →    03-api/CRM_SPECIFICATION.md
.github/workflows/     →    05-infrastructure/DEPLOYMENT.md
Dockerfile             →    04-guides/DOCKER.md
pnpm-lock.yaml         →    01-getting-started/REQUIREMENTS.md
frontend/              →    03-api/FRONTEND_TYPE_SAFETY.md
```

### Step 3: Make the Update

**Golden Rules**:

1. ✅ **Update CHANGELOG first**
   ```markdown
   # 0.4.1 (Unreleased)
   - Added: New authentication endpoint (POST /auth/login)
   - Fixed: Database connection timeout issue
   - Updated: API documentation with new endpoints
   ```

2. ✅ **Update the specific file**
   ```markdown
   # Example: Adding new API endpoint
   
   ## POST /auth/login
   
   **Authentication endpoint** for user login with credentials.
   
   ### Request
   ```json
   {
     "email": "user@example.com",
     "password": "secure_password"
   }
   ```
   ```

3. ✅ **Check for related files**
   - If you update API docs, also update TEAM_ONBOARDING.md if it references APIs
   - If you update architecture, check PROJECT_OVERVIEW.md consistency
   - If you update requirements, update INSTALLATION.md

4. ✅ **Validate links are still working**
   ```bash
   # Run validation script
   ./scripts/validate-docs.sh
   ```

### Step 4: Test Links

```bash
# Check for broken internal links
for file in docs/**/*.md; do
  grep -o '\[.*\](./[^)]*\.md)' "$file" | \
    while read -r link; do
      path=$(echo "$link" | sed -E 's/.*\(\.\/(.*)[-)].*$/\1/')
      if [ ! -f "docs/$path" ]; then
        echo "❌ BROKEN: $file → $path"
      fi
    done
done

# Quick validation for a single file
grep -o '\[.*\](./[^)]*\.md)' docs/01-getting-started/README.md
```

### Step 5: Preview Your Changes

```bash
# See the markdown rendered locally
cat docs/03-api/API_ENDPOINTS.md  # Review in VS Code markdown preview

# Check for markdown errors
npm run lint:docs  # If configured
```

### Step 6: Create Commit Message

**Format**: `docs: [type] [description]`

```bash
# Examples
git commit -m "docs: add new authentication endpoints"
git commit -m "docs: update environment variables for v0.4.1"
git commit -m "docs: fix broken link in DEPLOYMENT.md"
git commit -m "docs: update TypeScript patterns for new features"
git commit -m "docs: restructure database schema documentation"
```

### Step 7: Create Pull Request

PR title should reference the docs change:

```
feat: add jwt token refresh endpoint
- docs: update API_ENDPOINTS.md with new POST /auth/refresh endpoint
- docs: update CHANGELOG.md
```

### Step 8: Review & Merge

Reviewer checks:
- [ ] Links are valid
- [ ] Formatting is consistent with other files
- [ ] Bilingual if applicable
- [ ] No outdated information
- [ ] Related docs updated too

---

## 🔗 Link Validation Script

Create `scripts/validate-docs.sh`:

```bash
#!/bin/bash
set -e

echo "🔍 Validating documentation structure..."

# Check all markdown files exist
echo "  ✓ Checking file existence..."
for file in \
  docs/01-getting-started/README.md \
  docs/01-getting-started/INSTALLATION.md \
  docs/01-getting-started/CHANGELOG.md \
  docs/02-architecture/README.md \
  docs/03-api/API_ENDPOINTS.md \
  docs/04-guides/QUICK_START.md \
  docs/05-infrastructure/DEPLOYMENT.md \
  docs/06-database/DATABASE.md \
  docs/07-testing/TESTING_REPORT.md \
  TEAM_ONBOARDING.md \
  docs/INDEX.md \
  docs/VISUAL_GUIDE.md
do
  if [ ! -f "$file" ]; then
    echo "❌ MISSING: $file"
    exit 1
  fi
done

# Check for broken internal links
echo "  ✓ Checking internal links..."
broken_count=0
for file in docs/**/*.md TEAM_ONBOARDING.md; do
  while IFS= read -r line; do
    # Extract markdown links [text](path)
    if [[ $line =~ \[.*\]\(\.\/([^)]+)\) ]]; then
      link_path="${BASH_REMATCH[1]}"
      if [ ! -f "${link_path}" ]; then
        echo "❌ BROKEN LINK: $file → $link_path"
        ((broken_count++))
      fi
    fi
  done < "$file"
done

if [ $broken_count -gt 0 ]; then
  echo "❌ Found $broken_count broken links!"
  exit 1
fi

echo "✅ All validation checks passed!"
```

Run with:
```bash
chmod +x scripts/validate-docs.sh
./scripts/validate-docs.sh
```

---

## 📊 Update Checklists

### For NEW API Endpoint

```markdown
- [ ] Endpoint added to backend code
- [ ] New line in 03-api/API_ENDPOINTS.md
- [ ] Add request/response examples
- [ ] Add authentication requirements
- [ ] Add error codes & status responses
- [ ] Update 01-getting-started/CHANGELOG.md
- [ ] Update RELEASE_NOTES.md if releasing
- [ ] Test link validation
- [ ] Create PR with docs changes
```

### For VERSION BUMP

```markdown
- [ ] Update version in package.json
- [ ] Create 01-getting-started/RELEASE_NOTES.md entry
- [ ] Update 01-getting-started/CHANGELOG.md
- [ ] Update README.md version badge: [![Version](https://img.shields.io/badge/version-vX.X.X-blue.svg)]
- [ ] Update docs/02-architecture/ENVIRONMENT_SETUP.md version refs
- [ ] Update 07-testing/TESTING_REPORT.md with latest metrics
- [ ] Update docs/VISUAL_GUIDE.md statistics if applicable
- [ ] Validate all links
- [ ] Create git tag: git tag -a vX.X.X -m "Release vX.X.X"
```

### For ARCHITECTURE CHANGE

```markdown
- [ ] Update 02-architecture/README.md
- [ ] Update 04-guides/PROJECT_OVERVIEW.md
- [ ] Check if API_ENDPOINTS.md needs updates
- [ ] Check if ENVIRONMENT_SETUP.md needs updates
- [ ] Update 06-database/DATABASE.md if schema impacts
- [ ] Review and update related guides
- [ ] Validate all links
- [ ] Create PR with documentation updates
```

### For DEPLOYMENT PROCESS CHANGE

```markdown
- [ ] Update 05-infrastructure/DEPLOYMENT.md
- [ ] Update 04-guides/DOCKER.md if Docker-related
- [ ] Update 02-architecture/ENVIRONMENT_SETUP.md if env changes
- [ ] Update 01-getting-started/INSTALLATION.md if local setup changes
- [ ] Test the deployment process with new docs
- [ ] Validate all links
- [ ] Create PR and have DevOps review
```

---

## 🎯 Consistency Standards

### File Naming

- All lowercase with hyphens: `environment-setup.md` ✅
- No spaces: `Environment Setup.md` ❌
- Descriptive: `DOCKER.md` not `docker-guide.md` ✅

### Link Format

```markdown
✅ CORRECT:
[docs/INDEX.md](./docs/INDEX.md)
[TEAM_ONBOARDING.md](./TEAM_ONBOARDING.md)
[API Endpoints](./docs/03-api/API_ENDPOINTS.md)

❌ WRONG:
[docs/INDEX.md](docs/INDEX.md)           # Missing ./
[INDEX.md](./INDEX.md)                    # Too vague
`docs/INDEX.md` (inline code)            # Not a link
```

### Section Headings

```markdown
✅ CORRECT:
# Main Title (h1 - one per file)
## Section (h2 - major sections)
### Subsection (h3 - topics)
#### Detail (h4 - rarely needed)

❌ WRONG:
### Title (starting at h3)
## Section
# Subsection (wrong order)
```

### Bilingual Format

```markdown
## 🇪🇸 Título en Español

Explicación en español...

---

## 🇬🇧 English Title

English explanation...
```

### Code Block Format

```markdown
✅ Always specify language:

\`\`\`javascript
const hello = "world";
\`\`\`

✅ For terminal commands use bash:

\`\`\`bash
npm install
npm start
\`\`\`

❌ Never leave blank:

\`\`\`
code without language
\`\`\`
```

---

## 📅 Maintenance Schedule

### 🔄 Automated (Every 2 days at 14:00 UTC)

**Automatic Validation via GitHub Actions + Local Cron**

Documentation is automatically validated every **2 days at 14:00 UTC** (16:00 CEST / 10:00 EST):

**GitHub Actions** (Always Active):
- ✅ Runs automatically on schedule
- ✅ Validates all critical files
- ✅ Creates GitHub issues on failures
- 📊 Generates reports in `docs/validation-reports/`
- 📧 Notifies owner: `ipproyectossoluciones@gmail.com`

**Local Cron** (Optional - macOS/Linux Development):
```bash
# Install local cron job
bash scripts/install-cron-validation.sh

# View installed cron job
crontab -l | grep validate-and-report

# Manual execution anytime
bash scripts/validate-and-report.sh
```

**What gets validated automatically**:
- ✅ All critical files present
- ✅ Directory structure intact
- ✅ Internal links (50+) still valid
- ✅ File sizes (detect stubs <50 lines)
- ✅ Version references consistent
- ✅ Bilingual markers (ES+EN) present
- ✅ No TODO/FIXME comments left

**When validation fails**:
- 🔴 **Critical issues** → Issue created with `🔴-critico` label
- 🟠 **High priority** → Issue with `🟠-alto` label
- 🟡 **Medium priority** → Issue with `🟡-medio` label
- 📧 **Email notification** → To owner email

**Reports location**: `docs/validation-reports/validation_YYYYMMDD_HHMMSS.log`

**Monitoring dashboard**:
- GitHub Actions: https://github.com/ipproyectosysoluciones/psychology-assistant/actions
- Workflow: `.github/workflows/validate-docs-scheduled.yml`
- Local reports: See `docs/validation-reports/`

**Additional info**: See [VALIDATION_AUTOMATION.md](./VALIDATION_AUTOMATION.md)

---

### Weekly (Every Mon 10am)

- [ ] Review new commits to `docs/` folder
- [ ] Check for any TODO comments in docs
- [ ] Look for issues tagged `docs`
- **Note**: Validation happens automatically (check GitHub Actions results)

### Bi-weekly (Every other Wed)

- [ ] Review failed validations from automated reports
- [ ] Check for outdated version references
- [ ] Review TEAM_ONBOARDING metrics

### Monthly (1st of month)

- [ ] Full documentation review (all 32 files)
- [ ] Update statistics in VISUAL_GUIDE.md if changed
- [ ] Check for any validation reports that need attention
- [ ] Archive old RELEASE_NOTES if >3 versions old
- **Automated validation**: Runs on scheduled date

### Quarterly (Mar 1, Jun 1, Sep 1, Dec 1)

- [ ] Full audit of all categories and validation results
- [ ] Check bilingual consistency (automated + manual review)
- [ ] Review user feedback on docs
- [ ] Plan documentation improvements
- [ ] Analyze validation report trends

### On Release (vX.X.X)

- [ ] Create RELEASE_NOTES.md entry
- [ ] Update CHANGELOG.md with all changes
- [ ] Update version badges in README.md
- [ ] Update statistics in docs
- [ ] Tag repository: `git tag -a vX.X.X`
- [ ] Validate all 50+ links (done automatically before release)

---

## 👥 Role Responsibilities

### 👨‍💻 Backend Developer

**When you change code:**
- [ ] Update API docs if endpoints changed
- [ ] Update CHANGELOG.md
- [ ] Update ENVIRONMENT_SETUP.md if env vars changed
- [ ] Run link validation
- [ ] Include docs in PR

**Files you maintain**:
- `03-api/API_ENDPOINTS.md`
- `03-api/CRM_SPECIFICATION.md`
- `02-architecture/ENVIRONMENT_SETUP.md`
- `06-database/DATABASE.md` (schema)

### 🎨 Frontend Developer

**When you change code:**
- [ ] Update FRONTEND_TYPE_SAFETY.md if patterns changed
- [ ] Update API_ENDPOINTS.md usage if needed
- [ ] Update INSTALLATION.md if setup changed
- [ ] Include docs in PR

**Files you maintain**:
- `03-api/FRONTEND_TYPE_SAFETY.md`
- `01-getting-started/INSTALLATION.md` (frontend section)

### 🚀 DevOps/SRE

**When you change infrastructure:**
- [ ] Update DEPLOYMENT.md
- [ ] Update DOCKER.md
- [ ] Update ENVIRONMENT_SETUP.md if env changes
- [ ] Update REQUIREMENTS.md if new dependencies
- [ ] Test deployment with new docs
- [ ] Include docs in PR

**Files you maintain**:
- `05-infrastructure/DEPLOYMENT.md`
- `04-guides/DOCKER.md` + `05-infrastructure/DOCKER.md`
- `02-architecture/ENVIRONMENT_SETUP.md`
- `01-getting-started/REQUIREMENTS.md`

### 🏛️ Technical Lead/Architect

**Responsibilities**:
- [ ] Review all docs PRs
- [ ] Approve documentation changes
- [ ] Maintain architectural consistency
- [ ] Plan documentation improvements
- [ ] Review quarterly audits

**Files supervised**:
- `02-architecture/README.md`
- `04-guides/PROJECT_OVERVIEW.md`
- All docs for consistency

### 📊 Docs Maintainer (Designated)

**Responsibilities**:
- [ ] Coordinate all documentation updates
- [ ] Run weekly/monthly validations
- [ ] Maintain consistency across all files
- [ ] Fix broken links
- [ ] Archive old documents
- [ ] Update statistics monthly
- [ ] Review PRs for docs quality
- [ ] Answer questions about docs structure

**Files managed**:
- `/TEAM_ONBOARDING.md`
- `/docs/VISUAL_GUIDE.md`
- `/docs/INDEX.md`
- All category README.md files

---

## 🔧 Useful Scripts

### Quick validation
```bash
# Check if all critical files exist
for file in docs/INDEX.md docs/VISUAL_GUIDE.md TEAM_ONBOARDING.md; do
  [ -f "$file" ] && echo "✅ $file" || echo "❌ $file"
done
```

### Find files needing updates
```bash
# Files modified in last 7 days
find docs -name "*.md" -mtime -7

# Files modified since last release
git diff v0.4.0..HEAD --name-only docs/
```

### Extract TODO comments
```bash
# Find all TODO comments in docs
grep -r "TODO\|FIXME\|XXX" docs/ --include="*.md"
```

### Link statistics
```bash
# Count internal links
grep -r "\[.*\](\./" docs/ --include="*.md" | wc -l

# Every file that has links
grep -l "\[.*\](\./" docs/**/*.md
```

---

## 📋 Quality Metrics

Track these metrics monthly:

```
┌────────────────────────────────────┬────────┐
│ Metric                             │ Target │
├────────────────────────────────────┼────────┤
│ Broken Internal Links              │ 0      │
│ Outdated Version References        │ 0      │
│ Missing Code Examples              │ 0      │
│ % Bilingual Consistency (ES+EN)    │ 100%   │
│ Average Link Validation Time       │ <5min  │
│ Response Time to Update Requests   │ <24h   │
│ Documentation Coverage             │ 100%   │
│ Last Full Audit Date               │ Current│
└────────────────────────────────────┴────────┘
```

---

## 🚨 Document Lifecycle

### Created (NEW)

```
Developer adds: → Docs Maintainer reviews → Approved → Published
```

### Maintained (ACTIVE)

```
Regular updates → Link validation → Statistics update → Archive if version >2 old
```

### Archived (OLD)

```
Move to: docs/archive/releases/vX.X.X/ → Keep 3 old versions → Delete >3 old
```

---

## 🎯 Troubleshooting

### Issue: Broken Link in PR

**Solution**:
```bash
# Check relative path is correct
# If file is in docs/02-architecture/README.md
# And you want to link to docs/03-api/API_ENDPOINTS.md
# Use: [Link](../03-api/API_ENDPOINTS.md)

# Not: [Link](./docs/03-api/API_ENDPOINTS.md)
```

### Issue: Link Shows but File Missing

**Solution**:
```bash
# Verify file exists
ls -la docs/01-getting-started/INSTALLATION.md

# Create missing file if needed
touch docs/01-getting-started/INSTALLATION.md
```

### Issue: Bilingual Consistency

**Check**:
- [ ] Both ES and EN sections present
- [ ] Same structure in both languages
- [ ] Code examples identical
- [ ] Technical terms translated correctly

### Issue: Outdated Version Reference

**Search and replace**: 
```bash
# Find all v0.4.0 references
grep -r "v0.4.0" docs/

# Replace in all files
sed -i 's/v0.4.0/v0.5.0/g' docs/**/*.md
```

---

## 📖 Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Markdown Flavored](https://guides.github.com/features/mastering-markdown/)
- [Documentation Best Practices](https://www.writethedocs.org/guide/)
- [Clean Architecture in Docs](https://dev.to/)

---

## ✅ Sign-Off Checklist (For Maintainer)

Before marking docs as "maintained":

- [ ] All 32 files reviewed
- [ ] All 50+ links validated (working)
- [ ] No broken references
- [ ] Version numbers consistent
- [ ] Statistics current
- [ ] No TODO/FIXME comments
- [ ] Bilingual sections aligned
- [ ] Code examples up-to-date
- [ ] Screenshots/diagrams current
- [ ] No duplicate information
- [ ] Last review date recorded: ____

---

**Last Review**: 12 March 2026 | v0.4.0  
**Next Review**: 15 March 2026  
**Maintainer**: @Team  
**Status**: ✅ Active

*Questions? Open issue with `docs` tag or contact Tech Lead*
