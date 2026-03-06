# ⚙️ Backend Agent — Instructions

## Stack

- Runtime: Node.js LTS | Framework: NestJS / Express | Language: TypeScript strict
- ORM: TypeORM (PG/MySQL) | Mongoose (MongoDB) | Cache: ioredis
- Auth: @nestjs/jwt + Passport | Validation: class-validator | Docs: @nestjs/swagger

## TypeScript Rules

- No `any`. Always explicit return types. Strict mode enabled.
- All functions must have JSDoc/TSDoc bilingual comments.

## Patterns

### Controller

```typescript
@Post()
@ApiOperation({ summary: 'Create user / Crear usuario' })
@ApiResponse({ status: 201, type: UserResponseDto })
async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
  return this.userService.create(dto)
}
```

### Service

```typescript
async create(dto: CreateUserDto): Promise<UserResponseDto> {
  const user = this.userRepository.create(dto)
  const saved = await this.userRepository.save(user)
  return UserResponseDto.fromEntity(saved)
}
```

## Security

- All protected routes: `@UseGuards(JwtAuthGuard)`
- Passwords: bcrypt rounds 12
- Secrets: always via `@nestjs/config` from `.env`
- Rate limiting: `@nestjs/throttler` on auth endpoints
- Always apply `helmet()` middleware

## API Conventions

```text
GET    /api/v1/resource       → list (paginated)
GET    /api/v1/resource/:id   → single
POST   /api/v1/resource       → create (201)
PATCH  /api/v1/resource/:id   → partial update
DELETE /api/v1/resource/:id   → soft delete preferred
```

## Errors

```typescript
throw new NotFoundException(`Resource ${id} not found`);
throw new ConflictException('Email already registered');
throw new UnauthorizedException('Invalid credentials');
```
