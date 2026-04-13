# Skill Registry — psychology-assistant

Generated: 2026-04-12
Project: psychology-assistant

## Stack Detection

- **Backend**: Node.js (ES Modules) + Express 5 + Mongoose (MongoDB)
- **Frontend**: Angular 21 + TypeScript 5.9 + Angular Material
- **Package Manager**: pnpm
- **Monorepo**: No (separate package.json in root + frontend/)

## Project Conventions

| Source           | Path                         |
| ---------------- | ---------------------------- |
| Global AGENTS.md | ~/.config/opencode/AGENTS.md |

### Compact Rules (from AGENTS.md)

- **Commits**: Conventional commits only. No "Co-Authored-By" or AI attribution.
- **Build**: Never build after changes.
- **Questions**: When asking a question, STOP and wait for response. Never continue or assume answers.
- **Verification**: Never agree with user claims without verification. Say "dejame verificar" and check code/docs first.
- **Language**: Spanish input → Rioplatense Spanish (voseo). English input → warm, direct English.
- **Philosophy**: CONCEPTS > CODE. SOLID FOUNDATIONS. AGAINST IMMEDIACY.
- **Logging**: Use `pino` — import from `src/config/logger.js`. Pattern: `logger.info({ data }, 'message')` NOT `logger.info('message', { data })`

## User Skills (relevant to this project)

| Skill                        | Trigger                                           | Location                                    |
| ---------------------------- | ------------------------------------------------- | ------------------------------------------- |
| angular-architecture         | Angular project structure, component placement    | ~/.claude/skills/angular/architecture/      |
| angular-core                 | Angular components, signals, standalone, zoneless | ~/.claude/skills/angular/core/              |
| angular-forms                | Angular forms, validation, form state             | ~/.claude/skills/angular/forms/             |
| angular-performance          | Angular performance, images, lazy loading, SSR    | ~/.claude/skills/angular/performance/       |
| scope-rule-architect-angular | Angular 20+ architecture, Scope Rule, signals     | ~/.config/opencode/skills/angular/          |
| typescript                   | TypeScript strict patterns and best practices     | ~/.config/opencode/skills/typescript/       |
| github-pr                    | PR descriptions, conventional commits             | ~/.claude/skills/github-pr/                 |
| technical-review             | Code assessments, candidate submissions           | ~/.config/opencode/skills/technical-review/ |
| pr-review                    | Review PRs and issues, open source projects       | ~/.config/opencode/skills/pr-review/        |

### Skill Match Rules

| File Pattern                                                       | Skills to Inject                                     |
| ------------------------------------------------------------------ | ---------------------------------------------------- |
| `frontend/**/*.ts`, `frontend/**/*.html`                           | angular-core, angular-architecture, typescript       |
| `frontend/**/*form*`, `frontend/**/*reactive*`                     | angular-forms                                        |
| `frontend/**/*image*`, `frontend/**/*lazy*`, `frontend/**/*defer*` | angular-performance                                  |
| `src/**/*.js` (backend)                                            | (no specific skill — standard Node/Express patterns) |
| `*.spec.ts`, `*.test.js`                                           | (test context — apply stack-appropriate patterns)    |
| PR creation / review                                               | github-pr, pr-review                                 |
