# 🚀 Frontend Builder — Instructions

## Specialization

### Primary Focus

- **CRUD Form Components** with advanced validation
- **Landing Pages** with SEO optimization
- **Marketing Copywriting** (Spanish-first, bilingual)
- **Material Design** implementation in Angular

### Technology Stack

- **Angular** 21+ | TypeScript strict | Angular Material | SCSS
- **Reactive Forms** with custom validators
- **Material CDK** for accessibility
- **Tailwind + SCSS** for responsive design

---

## Angular Form Rules

### Reactive Forms (MANDATORY)

```typescript
// ✅ CORRECT: Reactive Forms with strong typing
export class ClinicFormComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^\+?[\d\s-()]{10,}$/)],
    ],
  });
}

// ❌ WRONG: Template-driven forms (FORBIDDEN)
```

### Change Detection

- `OnPush` change detection on **ALL** components
- Use `ChangeDetectionStrategy.OnPush` explicitly
- Unsubscribe with `takeUntilDestroyed()` (Angular 16+)

### Dependency Injection

```typescript
// ✅ CORRECT: inject() function (Angular 16+)
export class ClinicFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private clinicService = inject(ClinicService);
  private router = inject(Router);
}

// ❌ WRONG: Constructor injection (old pattern)
```

### Subscription Management

```typescript
// ✅ CORRECT: Auto-unsubscribe
private destroy$ = new Subject<void>();

ngOnInit() {
  this.clinicService.getAll()
    .pipe(takeUntilDestroyed(this))
    .subscribe(clinics => this.clinics = clinics);
}

// ✅ ALTERNATIVE: Using takeUntilDestroyed()
this.clinicService.getall()
  .pipe(takeUntilDestroyed())
  .subscribe(clinics => this.clinics = clinics);
```

---

## Form Validation Rules

### Custom Validators

```typescript
// ✅ Example: License expiry validator
function validateLicenseExpiry(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const expiryDate = new Date(control.value);
    return expiryDate > new Date() ? null : { expiredLicense: true };
  };
}

// Usage in form
license_expiry: ['', [Validators.required, validateLicenseExpiry()]];
```

### Standard Validators (ALL forms must include)

- **Email**: `Validators.email` + custom regex for international domains
- **Phone**: Custom regex: `/^\+?[\d\s-()]{10,}$/`
- **Amount/Price**: `Validators.min(0.01)`, `Validators.pattern(/^\d+(\.\d{1,2})?$/)`
- **Currency Code**: Match ISO 4217 (UYU, USD, ARG, etc.)
- **Date**: Custom validator for valid date range
- **CIE-10 Codes**: Regex pattern validation

### Error Messages (SPANISH FIRST)

```typescript
errors: {
  required: 'Este campo es obligatorio',
  email: 'Ingresa un correo válido',
  minlength: 'Mínimo {{requiredLength}} caracteres',
  pattern: 'Formato inválido',
  min: 'El valor debe ser mayor a {{min}}',
  expiredLicense: 'La licencia ha expirado',
}
```

---

## Material Design Implementation

### Form Components Structure

```typescript
// ✅ CORRECT: Material form with proper structure
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <mat-form-field appearance="outline">
    <mat-label>Nombre de Clínica</mat-label>
    <input matInput formControlName="name" placeholder="Ingresa el nombre">
    <mat-error *ngIf="form.get('name')?.hasError('required')">
      {{ errors.required }}
    </mat-error>
    <mat-error *ngIf="form.get('name')?.hasError('minlength')">
      {{ errors.minlength }}
    </mat-error>
  </mat-form-field>

  <button mat-raised-button color="primary" [disabled]="!form.valid">
    Guardar
  </button>
</form>
```

### Material Components (Use These)

- `<mat-form-field>` (appearance="outline")
- `<mat-select>` for dropdowns
- `<mat-slide-toggle>` for booleans
- `<mat-datepicker>` for dates
- `<mat-chips>` for multi-select
- `<mat-accordion>` for expandable sections
- `<mat-spinner>` for loading

### Loading States

```typescript
// Display spinner during submit
form.disable();
button [disabled]="isLoading || !form.valid"

// After submit
this.isLoading = true;
this.service.create(data).pipe(
  finalize(() => this.isLoading = false)
).subscribe(...);
```

---

## Landing Page Requirements

### Sections (MANDATORY)

1. **Navbar**

   - Sticky/fixed at top
   - Brand logo (left)
   - Navigation links: Features | Testimonials | Contact | Pricing (center)
   - Auth buttons: Login | Register (right)
   - Mobile hamburger menu

2. **Hero Section**

   - Bold headline (ES): "Gestión Integral de tu Consultorio Psicológico"
   - Subheading with value proposition
   - Two CTA buttons:
     - Primary: "Acceder al Dashboard"
     - Secondary: "Ver Demostración"
   - Hero image/illustration (right side, responsive)

3. **Features Section**

   - 6 feature cards (matching CRM entities):
     1. Multi-clinic management
     2. Therapist directory & scheduling
     3. Patient medical records
     4. Clinical documentation
     5. Integrated billing system
     6. Progress reporting
   - Each card: Icon + Title + Description
   - Responsive: 3 cols desktop, 1 col mobile

4. **Testimonials** (Optional but Recommended)

   - 3-4 therapist/admin testimonials
   - Avatar + Name + Quote + Role

5. **Call-to-Action Section**

   - Headline: "¿Listo para llevar tu consultorio al siguiente nivel?"
   - Subtext with benefit
   - CTA buttons: "Comenzar Ahora" | "Hablar con Ventas"

6. **Footer**
   - Links: Términos | Privacidad | Contacto | Sobre Nosotros
   - Contact info (email, phone)
   - Social media links
   - Copyright

---

## SEO Optimization Rules

### Meta Tags (Title, Description)

```typescript
// Via RouterModule + Angular SEO
<title>Consultorio Psicológico | Gestión Integral | Psychology Assistant</title>
<meta name="description" content="Plataforma integral para gestionar tu consultorio psicológico. Appointment scheduling, medical records, billing, clinical reports.">
<meta name="keywords" content="consultorio, psicología, gestión, cita, paciente, facturación">
```

### Semantic HTML (Landing Page)

```html
<!-- ✅ CORRECT: Semantic structure -->
<header> <!-- Navigation -->
<main>
  <section id="hero"> <!-- Hero -->
  <section id="features"> <!-- Features -->
  <section id="testimonials"> <!-- Testimonials -->
  <section id="cta"> <!-- Call to Action -->
</main>
<footer> <!-- Footer -->

<!-- ❌ WRONG: Non-semantic <div> everywhere -->
```

### Heading Hierarchy

- H1: One per page, descriptive (Hero main headline)
- H2: Section headlines (Features, Testimonials, etc.)
- H3: Sub-sections and features

### Image Optimization

- Use `<img alt="description">` (descriptive alt text)
- Responsive images: `srcset` for multiple sizes
- Lazy loading: `loading="lazy"`
- Format: WebP with PNG fallback

### OpenGraph Tags (Sharing)

```html
<meta property="og:title" content="Psychology Assistant" />
<meta
  property="og:description"
  content="Platform for managing your psychological practice"
/>
<meta property="og:image" content="https://domain.com/og-image.png" />
<meta property="og:url" content="https://domain.com" />
```

---

## Marketing Copywriting Rules

### Language Preference

- **Primary**: Spanish (ES) - Natural, persuasive, professional
- **Fallback**: English (EN) - For international users
- **Tone**: Professional, empowering, solution-focused

### Headline Formulas

- **Hero**: Problem + Solution (e.g., "Gestión Integral de tu Consultorio Psicológico")
- **Features**: Benefit-first (e.g., "Más Pacientes, Menos Papelería")
- **CTA**: Action + Benefit (e.g., "Acceder al Dashboard - 14 días gratis")

### Call-to-Action Copy

- **Primary Button**: Action verb + benefit

  - ✅ "Acceder al Dashboard"
  - ✅ "Comenzar 14 días gratis"
  - ❌ "Click aquí" (generic, weak)

- **Secondary Button**: Lower intent (info, demo)
  - ✅ "Ver Demostración"
  - ✅ "Hablar con Ventas"
  - ❌ "Más información"

### Feature Descriptions

```
❌ WEAK: "Sistema de historiales médicos"
✅ STRONG: "Historiales Médicos Digitales - Toda la información de tu paciente en un lugar seguro"

❌ WEAK: "Gestión de citas"
✅ STRONG: "Citas Inteligentes - Reduce no-shows con recordatorios automáticos"
```

---

## Component Structure Pattern

### Directory Layout

```
frontend/src/app/
├── clinic/
│   ├── clinic-list/
│   │   ├── clinic-list.component.ts
│   │   ├── clinic-list.component.html
│   │   ├── clinic-list.component.scss
│   │   └── clinic-list.component.spec.ts
│   ├── clinic-form/
│   ├── clinic-detail/
│   └── clinic-routing.module.ts

├── landing/  (NEW)
│   ├── landing.component.ts
│   ├── landing.component.html
│   ├── landing.component.scss
│   ├── landing.component.spec.ts
│   └── sections/
│       ├── navbar/
│       ├── hero/
│       ├── features/
│       ├── testimonials/
│       ├── cta/
│       └── footer/
```

### Naming Conventions

- **Component file**: `{entity}-{action}.component.ts`
  - clinic-form.component.ts
  - therapist-list.component.ts
  - patient-detail.component.ts
- **HTML template**: Same filename with `.html`
- **Styles**: Same filename with `.scss`
- **Tests**: Same filename with `.spec.ts`

---

## Accessibility Requirements

### WCAG AA Compliance (Minimum)

- Color contrast ratio ≥ 4.5:1 for text
- All interactive elements keyboard-accessible (Tab navigation)
- Form errors linked to inputs via `aria-describedby`

### ARIA Labels

```html
<!-- Icon buttons MUST have aria-label -->
<button mat-icon-button aria-label="Editar clínica">
  <mat-icon>edit</mat-icon>
</button>

<!-- Form fields MUST have accessible labels -->
<mat-form-field>
  <mat-label>Nombre de Clínica</mat-label>
  <input matInput formControlName="name" />
</mat-form-field>
```

### Mobile Responsiveness

- Touch targets: ≥ 44px x 44px
- Breakpoints: 320px (mobile) | 768px (tablet) | 1024px (desktop)
- Test on real devices (not just browser dev tools)

---

## Code Quality Standards

### TypeScript

- **No `any` type** — Always use explicit types
- **Strict mode**: `strict: true` in tsconfig.json
- **No unused variables** or imports

### Prettier Config

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "trailingComma": "all"
}
```

### ESLint Rules

- No console logs in production code
- No debugger statements
- No magic numbers — use named constants

### Comments (Bilingual JSDoc)

```typescript
/**
 * Creates a new clinic in the system.
 * Crea una nueva clínica en el sistema.
 *
 * @param clinic - Clinic data / Datos de la clínica
 * @returns Promise<Clinic> - Created clinic / Clínica creada
 */
createClinic(clinic: CreateClinicDto): Promise<Clinic> {
  // Implementation
}
```

---

## Testing Requirements

### Unit Tests (Jasmine)

- **Coverage**: Minimum 80%
- **File naming**: `{component}.spec.ts`
- **Location**: Alongside component file

```typescript
describe('ClinicFormComponent', () => {
  let component: ClinicFormComponent;
  let fixture: ComponentFixture<ClinicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClinicFormComponent],
      imports: [ReactiveFormsModule, MatFormFieldModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable submit button when form is invalid', () => {
    component.form.patchValue({ name: '' });
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBe(true);
  });
});
```

---

## Quick Reference Checklist

- [ ] Component uses `OnPush` change detection
- [ ] All subscriptions use `takeUntilDestroyed()`
- [ ] Form uses Reactive Forms with strong typing
- [ ] All form fields have custom validators where applicable
- [ ] Error messages are in Spanish (with English fallback)
- [ ] Material Design components properly implemented
- [ ] Loading states on buttons/forms during submission
- [ ] Responsive design tested on mobile + desktop
- [ ] Landing page has all 6 required sections
- [ ] SEO meta tags included (title, description, OG tags)
- [ ] Accessibility: ARIA labels, semantic HTML, color contrast
- [ ] No `any` types in TypeScript
- [ ] Comments are bilingual (ES/EN)
- [ ] Unit tests cover happy path + error cases
- [ ] No console logs in production code

---

## Tools & Resources

- **Angular Material**: https://material.angular.io/
- **Reactive Forms**: https://angular.io/guide/reactive-forms
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **SEO Best Practices**: https://developers.google.com/search/docs
