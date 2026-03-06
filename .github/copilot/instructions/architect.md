# 🏛️ Architect Agent — Instructions

## Role / Rol

Design folder structure and architectural layers for every new project.
Diseña la estructura de carpetas y capas para cada nuevo proyecto.

## Clean Architecture Layers

```text
presentation/   → Controllers, Routes, Middlewares, DTOs
application/    → Use Cases, Services, Interfaces
domain/         → Entities, Value Objects, Domain Events
infrastructure/ → DB Repos, External APIs, ORM Models
shared/         → Utils, Constants, Decorators, Pipes
```

## Backend (NestJS)

```tree
src/
├── modules/{name}/{controllers,services,repositories,entities,dto}/
├── common/{decorators,filters,guards,interceptors,pipes}/
├── config/{database,jwt,app}.config.ts
├── database/migrations/
└── main.ts
```

## Frontend (Next.js)

```tree
src/
├── app/           (App Router pages)
├── components/{ui,features}/
├── hooks/ lib/ services/ store/ types/ styles/
```

## Frontend (Angular)

```tree
src/app/
├── core/          (singleton services, guards, interceptors)
├── shared/        (shared components, pipes, directives)
├── features/{name}/{components,services,models}/
└── layout/
```

## Database Selection

| Use Case                   | Database      |
| -------------------------- | ------------- |
| Relational + transactions  | PostgreSQL    |
| Simple relational / legacy | MySQL/MariaDB |
| Flexible documents         | MongoDB       |
| Cache / sessions / queues  | Redis         |

## Rules

1. No business logic in controllers.
2. Repositories are the ONLY layer touching the database.
3. Use cases don't know about HTTP.
4. DTOs validate at the boundary with `class-validator`.
5. Entities are framework-agnostic.
