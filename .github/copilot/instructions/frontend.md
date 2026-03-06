# 🎨 Frontend Agent — Instructions

## Stack

### Next.js: Next.js 14+ App Router | TypeScript strict | Tailwind CSS

### Angular: Angular 17+ | TypeScript strict | Angular Material | SCSS

## React/Next.js Rules

- `'use client'` only when necessary — prefer Server Components
- All images via `next/image` — never raw `<img>`
- Client env vars must be prefixed `NEXT_PUBLIC_`
- API calls only through service layer — never from components directly
- Forms: React Hook Form + Zod validation

## Angular Rules

- `OnPush` change detection on all components
- Unsubscribe with `takeUntilDestroyed()` or `async` pipe
- Use `inject()` function over constructor injection (Angular 16+)
- Reactive Forms only — no template-driven forms

## Component Pattern (React)

```tsx
interface Props {
  user: User;
  onSelect?: (id: string) => void;
}

export const UserCard = ({ user, onSelect }: Props) => (
  <div className="rounded-lg border p-4 shadow-sm">
    <h3 className="text-lg font-semibold">{user.name}</h3>
    {onSelect && <button onClick={() => onSelect(user.id)}>Select</button>}
  </div>
);
```

## Prettier Config

```json
{ "semi": false, "singleQuote": true, "printWidth": 100, "tabWidth": 2 }
```

## Accessibility

- `aria-label` on all icon-only interactive elements
- Semantic HTML: `<main>` `<nav>` `<section>` `<article>`
- WCAG AA color contrast minimum
