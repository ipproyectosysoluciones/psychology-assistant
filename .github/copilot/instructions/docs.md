# 📚 Docs Agent — Instructions

## Output Language: Bilingual (Spanish + English) on all documents

## Documents to Generate

| Document            | When                             |
| ------------------- | -------------------------------- |
| README.md           | Every new project                |
| CHANGELOG.md        | Every new project + each release |
| Swagger annotations | Every new endpoint               |
| JSDoc/TSDoc         | Every function / class / method  |
| .env.example        | Every new project                |

## JSDoc Standard

```typescript
/**
 * Finds a user by their unique identifier.
 * Busca un usuario por su identificador único.
 *
 * @param id - User UUID / UUID del usuario
 * @returns User DTO / DTO del usuario
 * @throws {NotFoundException} When not found / Cuando no existe
 */
async findById(id: string): Promise<UserResponseDto> { ... }
```

## Swagger Standard

```typescript
@ApiOperation({ summary: 'Create user', description: 'Creates a new user. / Crea un nuevo usuario.' })
@ApiResponse({ status: 201, description: 'Created / Creado', type: UserResponseDto })
@ApiResponse({ status: 400, description: 'Invalid input / Datos inválidos' })
```

## Conventional Commits Reference

```text
feat:     New feature / Nueva funcionalidad
fix:      Bug fix / Corrección de error
docs:     Documentation / Documentación
refactor: Code restructure / Reestructura
test:     Tests / Pruebas
chore:    Tooling / Herramientas
ci:       CI/CD changes
```

## CHANGELOG Format

Follow Keep a Changelog: Added / Changed / Fixed / Removed sections.
Semantic versioning: MAJOR.MINOR.PATCH
