# 🛡️ GitHub Branch Protection Setup

Quick guide to configure branch protection rules for production-ready deployments.

## 30-Second Setup

1. Go to: **Settings → Branches → Add rule**
2. Pattern: `main`
3. Enable 3 key checkboxes:
   - ✅ Require status checks to pass
   - ✅ Require pull request reviews before merging
   - ✅ Dismiss stale pull request approvals
4. Click **"Create"**

---

## Complete Protection Rules for Main Branch

### Access Settings

**Settings → Branches → Add branch protection rule**

| Rule                    | Setting | Description                        |
| ----------------------- | ------- | ---------------------------------- |
| **Branch name pattern** | `main`  | Protect the main production branch |

### Require Pull Request Reviews

- ☑️ **Require a pull request before merging**
  - Minimum number of reviewers: **1** (or more for teams)
  - Dismiss stale pull request approvals when new commits: **YES**
  - Require review from code owners: **YES** (if CODEOWNERS file exists)

**Effect:** Cannot push directly to main; must use pull request.

### Require Status Checks

- ☑️ **Require status checks to pass before merging**
  - **Select required workflows:**
    - ci-cd ✅
    - test ✅
    - lint ✅
    - build ✅
  - Connections: At least **1** status check
  - **Require branches to be up to date:** YES

**Effect:** CI/CD must pass before merge is allowed.

### Enforce Code Style

- ☑️ **Require code reviews before merging**
  - Minimum reviewers: **1**
  - Dismiss stale: **YES**

### Restrict Direct Commits

- ☑️ **Require conversations to be resolved before merging**

**Effect:** All PR comments/suggestions must be marked as resolved.

### Administrators

- ☑️ **Include administrators:** YES
- ☑️ **Require approval of the most recent reviewable push:** YES

**Effect:** Even admins cannot bypass rules (best practice).

### Automatic Actions

- ☑️ **Auto-delete head branches on merge**

**Effect:** Cleanup feature branches automatically.

---

## Step-by-Step: Web Interface

### Step 1: Navigate

```
GitHub Repo Home
  → Settings (right sidebar)
    → Branches (left sidebar)
      → Add rule (button)
```

### Step 2: Configure Pattern

```
Branch name pattern:  main
```

### Step 3: Enable PR Requirement

```
☑ Require a pull request before merging
  Minimum number of reviews: 1
  ☑ Require code owner reviews
  ☑ Dismiss stale pull request approvals
```

### Step 4: Enable Status Checks

```
☑ Require status checks to pass before merging
  ☑ Require branches to be up to date

  Select status checks:
  ☑ ci-cd
  ☑ test
  ☑ lint
  ☑ build
```

### Step 5: Additional Security

```
☑ Require code reviews before merging
☑ Require conversation resolution before merging
☑ Require a pull request before merging
☑ Include administrators
```

### Step 6: Auto-Cleanup

```
☑ Automatically delete head branches
```

### Step 7: Save

Click **"Create"** button

---

## Optional: Development Branch Protection

For `development/**` or `staging` branches, use lighter protection:

```
Branch name pattern: development/*

Requirements:
  ☑ Require pull request before merging
    - Minimum reviews: 1
    - Dismiss stale: YES
  ☑ Require status checks to pass
    - test, lint
  ☑ Auto-delete head branches
```

Less strict than main but still maintains code quality.

---

## Verifying Protection

After setup, verify with:

1. **Try pushing to main directly:**

   ```bash
   git push origin main
   # Should be REJECTED
   ```

2. **Try merging without PR:**

   ```
   Not possible via web - must use PR
   ```

3. **Try merging without status checks:**

   ```
   Merge button DISABLED until CI passes
   ```

4. **Try merging without reviews:**
   ```
   Merge button DISABLED until review approved
   ```

---

## CI/CD Workflow Integration

The following workflows will be required status checks:

```yaml
# Required to pass before merge:
- test.yml       (Jest + Angular tests)
- lint.yml       (ESLint, TypeScript, Prettier)
- build.yml      (Docker builds)
- ci-cd.yml      (Orchestrator - meta check)
```

All must pass green ✅ before merge can proceed.

---

## Protect Other Branches (Optional)

### Release Branches

Pattern: `release/**`

```
Require:
  ☑ 2 reviewers (for releases)
  ☑ Status checks to pass
```

### Hotfix Branches

Pattern: `hotfix/**`

```
Require:
  ☑ 1 reviewer
  ☑ Status checks to pass
```

---

## Enforce via Command Line (GitOps)

If you prefer Infrastructure as Code, use GitHub CLI:

```bash
# Require status checks
gh repo create-protection-rule main \
  --require-status-checks \
  --required-status-checks=ci-cd \
  --required-status-checks=test \
  --required-status-checks=lint

# Require reviewers
gh repo create-protection-rule main \
  --require-pull-request-reviews \
  --required-approving-review-count=1

# Require conversations resolved
gh repo create-protection-rule main \
  --require-conversation-resolution
```

---

## Troubleshooting

### "Cannot merge - status checks failed"

**Solution:** Wait for CI/CD to complete and pass

```bash
# Check workflow status
gh run list --repo ipproyectosysoluciones/psychology-assistant

# Or view in GitHub Actions tab
```

### "Cannot merge - stale review"

**Solution:** New commits invalidated approval. Re-request review:

```
PR page → Request re-review from reviewers
```

### "Allow force push" but protection active

**Warning:** Don't enable force push with branch protection!

```
❌ Never enable: "Allow force pushes"
✅ Use: "Require pull request reviews" instead
```

### Admin bypassing protection

If admin bypassed protection by accident:

```
Enable: ☑ Include administrators
This prevents accidental bypasses
```

---

## Best Practices

### ✅ DO

- Require 1+ reviews for all PRs
- Require status checks (CI must pass)
- Require branches up to date (no merge conflicts)
- Auto-delete head branches (cleanup)
- Include administrators (enforces discipline)
- Require conversation resolution

### ❌ DON'T

- Allow direct force pushes
- Allow dismissing status checks
- Require fewer than 1 reviewer
- Skip code owner reviews
- Disable protection for "quick fixes"

---

## Testing Branch Protection

### Test 1: Direct Push (Should Fail)

```bash
git checkout main
echo "test" >> README.md
git add README.md
git commit -m "test"
git push origin main

# Expected: REJECTED by GitHub
# Error: "Your push was rejected"
```

### Test 2: PR Without Status Checks (Should Block Merge)

```bash
git checkout -b feature/test
echo "feature" >> README.md
git add . && git commit -m "feature"
git push origin feature/test

# Create PR on GitHub
# Expected: Merge button DISABLED
# Reason: Status checks not passing
```

### Test 3: PR Without Approval (Should Block Merge)

```
# Create PR
# Try to merge without approval
# Expected: Merge button DISABLED
# Reason: Needs at least 1 approval
```

---

## Verify Current Rules

```bash
# List branch protection rules
gh api repos/ipproyectosysoluciones/psychology-assistant/branches/main/protection

# Should return JSON with protection details
```

---

## Related Documentation

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment guide
- [SECRETS.md](./.github/SECRETS.md) - GitHub secrets setup
- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) (modern alternative)

---

**Last Updated:** March 12, 2026  
**Version:** 0.3.0  
**Status:** 🟢 Production Ready
