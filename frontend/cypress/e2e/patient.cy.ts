/**
 * ES: Pruebas e2e para flujos de Pacientes
 * EN: e2e tests for Patient flows
 */

describe('Patient CRUD Operations', () => {
  const testPatient = {
    idType: 'CC',
    idNumber: '123456789',
    dateOfBirth: '1990-01-01',
    gender: 'M',
    address: 'Calle 123, Apt 456',
    phone: '3001234567',
    employmentStatus: 'employed',
  };

  beforeEach(() => {
    // Login
    cy.visit('/auth/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should navigate to patient list', () => {
    cy.visit('/patient');
    cy.get('h1').should('contain', 'Pacientes');
    cy.url().should('include', '/patient');
  });

  it('should create a new patient', () => {
    cy.visit('/patient');
    cy.get('button').contains('Nuevo Paciente').click();
    cy.url().should('include', '/patient/form');

    // Fill form
    cy.typeFormField('idType', testPatient.idType);
    cy.typeFormField('idNumber', testPatient.idNumber);
    cy.typeFormField('dateOfBirth', testPatient.dateOfBirth);
    cy.typeFormField('gender', testPatient.gender);
    cy.typeFormField('address', testPatient.address);
    cy.typeFormField('phone', testPatient.phone);
    cy.typeFormField('employmentStatus', testPatient.employmentStatus);

    // Submit
    cy.get('button').contains('Guardar').click();

    // Verify success
    cy.get('.success-snackbar').should('contain', 'creado exitosamente');
    cy.url().should('include', '/patient');
  });

  it('should view patient details', () => {
    cy.visit('/patient');
    cy.get('table tbody tr').first().click();
    cy.url().should('match', /\/patient\/[a-f0-9]+$/);
    cy.get('h1').should('contain', 'Detalle de Paciente');
  });

  it('should edit a patient', () => {
    cy.visit('/patient');
    cy.get('table tbody tr').first().click();

    // Click edit button
    cy.get('button').contains('Editar').click();
    cy.url().should('match', /\/patient\/form\/[a-f0-9]+$/);

    // Modify field
    cy.typeFormField('phone', '3009999999');

    // Submit
    cy.get('button').contains('Guardar').click();

    // Verify success
    cy.get('.success-snackbar').should('contain', 'actualizado exitosamente');
  });

  it('should delete a patient', () => {
    cy.visit('/patient');
    cy.get('table tbody tr').first().click();

    // Click delete button
    cy.get('button').contains('Eliminar').click();

    // Confirm deletion in dialog
    cy.get('[role="dialog"]').should('exist');
    cy.get('[role="dialog"] button').contains('Eliminar').click();

    // Verify success
    cy.get('.success-snackbar').should('contain', 'eliminado exitosamente');
    cy.url().should('include', '/patient');
  });

  it('should show validation error for required fields', () => {
    cy.visit('/patient/form');

    // Try to submit empty form
    cy.get('button').contains('Guardar').click();

    // Verify error message
    cy.get('mat-error').should('be.visible');
  });

  it('should handle API error gracefully', () => {
    // Mock API error
    cy.intercept('POST', '**/patient', {
      statusCode: 500,
      body: { message: 'Server error' },
    });

    cy.visit('/patient/form');
    cy.fillPatientForm(testPatient);
    cy.get('button').contains('Guardar').click();

    // Verify error snackbar
    cy.get('.error-snackbar').should('contain', 'Server error');
    cy.get('button').contains('Guardar').should('not.be.disabled');
  });
});

describe('Patient Filtering & Search', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/patient');
  });

  it('should filter patients by status', () => {
    cy.get('select[name="status"]').select('active');
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).should('contain', 'Activo');
    });
  });

  it('should search patients by name or id', () => {
    cy.get('input[placeholder*="Buscar"]').type('Juan');
    cy.get('button').contains('Buscar').click();
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });
});

describe('Patient Performance', () => {
  it('should load patient list within acceptable time', () => {
    cy.login();
    cy.visit('/patient');
    cy.window().then((win) => {
      const start = performance.now();
      cy.get('table tbody tr').should('have.length.greaterThan', 0);
      const end = performance.now();
      expect(end - start).to.be.lessThan(3000); // 3 seconds
    });
  });

  it('should handle large datasets efficiently', () => {
    cy.login();
    cy.intercept('GET', '**/patient**', {
      statusCode: 200,
      body: {
        data: generateMockPatients(1000),
        pagination: { page: 1, limit: 50, total: 1000 },
      },
    });

    cy.visit('/patient');
    cy.get('table tbody tr').should('have.length', 50); // Paginated
  });
});

// Helper functions
function generateMockPatients(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `patient-${i}`,
    idNumber: `${100000000 + i}`,
    dateOfBirth: '1990-01-01',
    gender: 'M',
    address: `Calle ${i}`,
    phone: `300${i}`,
    status: 'active',
  }));
}
