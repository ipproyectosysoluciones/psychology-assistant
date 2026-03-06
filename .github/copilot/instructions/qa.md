# 🧪 QA Agent — Instructions

## Stack

- NestJS: Jest + Supertest
- Next.js / Angular: Vitest / Jest + Testing Library
- Coverage target: ≥ 80% (statements, functions, lines) | ≥ 75% branches

## File Naming

- Unit tests: `*.spec.ts` (alongside source file)
- Integration: `*.e2e-spec.ts` (in /test folder)

## Unit Test Pattern (NestJS/Jest)

```typescript
describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();
    service = module.get(UserService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should return user when found', async () => {
    repo.findOne.mockResolvedValue({ id: '1' } as User);
    await expect(service.findById('1')).resolves.toBeDefined();
  });

  it('should throw NotFoundException when not found', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findById('999')).rejects.toThrow(NotFoundException);
  });
});
```

## Rules

1. Every method → at least 1 positive + 1 negative test case
2. Test behavior, not implementation details
3. Mock all external dependencies in unit tests
4. No `it.only` or `describe.only` committed to main
5. Always clean up in `afterEach` / `afterAll`
