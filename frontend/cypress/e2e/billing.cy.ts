/**
 * ES: Pruebas e2e para flujos de Facturación
 * EN: e2e tests for Billing flows
 */

describe('Billing CRUD Operations', () => {
  const testBilling = {
    invoiceNumber: 'INV-2024-001',
    amount: 150000,
    currency: 'COP',
    description: 'Servicio de psicoterapia - sesión 1',
    paymentMethod: 'transfer',
    status: 'draft',
  };

  beforeEach(() => {
    cy.login();
  });

  it('should navigate to billing list', () => {
    cy.visit('/billing');
    cy.get('h1').should('contain', 'Facturación');
    cy.url().should('include', '/billing');
  });

  it('should create a new billing record', () => {
    cy.visit('/billing');
    cy.get('button').contains('Nueva Factura').click();
    cy.url().should('include', '/billing/form');

    // Fill form
    cy.typeFormField('invoiceNumber', testBilling.invoiceNumber);
    cy.typeFormField('amount', testBilling.amount.toString());
    cy.typeFormField('currency', testBilling.currency);
    cy.typeFormField('description', testBilling.description);
    cy.typeFormField('paymentMethod', testBilling.paymentMethod);

    // Submit
    cy.get('button').contains('Guardar').click();

    // Verify success
    cy.get('.success-snackbar').should('contain', 'creado exitosamente');
    cy.url().should('include', '/billing');
  });

  it('should view billing details', () => {
    cy.visit('/billing');
    cy.get('table tbody tr').first().click();
    cy.url().should('match', /\/billing\/[a-f0-9]+$/);
    cy.get('h1').should('contain', 'Detalle de Factura');
  });

  it('should edit billing record', () => {
    cy.visit('/billing');
    cy.get('table tbody tr').first().click();

    // Click edit
    cy.get('button').contains('Editar').click();
    cy.url().should('match', /\/billing\/form\/[a-f0-9]+$/);

    // Modify
    cy.typeFormField('amount', '200000');

    // Submit
    cy.get('button').contains('Guardar').click();

    // Verify
    cy.get('.success-snackbar').should('contain', 'actualizado exitosamente');
  });

  it('should delete billing record', () => {
    cy.visit('/billing');
    cy.get('table tbody tr').first().click();

    // Delete
    cy.get('button').contains('Eliminar').click();
    cy.get('[role="dialog"]').should('exist');
    cy.get('[role="dialog"] button').contains('Eliminar').click();

    // Verify
    cy.get('.success-snackbar').should('contain', 'eliminado exitosamente');
    cy.url().should('include', '/billing');
  });
});

describe('Billing Workflows', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should transition billing from draft to sent to paid', () => {
    cy.visit('/billing');
    cy.get('table tbody tr').first().click();

    // Check initial status
    cy.get('span').contains('Borrador').should('exist');

    // Mark as sent
    cy.get('button').contains('Marcar como Enviado').click();
    cy.get('span').contains('Enviado').should('exist');

    // Mark as paid
    cy.get('button').contains('Marcar como Pagado').click();
    cy.get('span').contains('Pagado').should('exist');
  });

  it('should calculate totals correctly', () => {
    cy.visit('/billing/form');

    // Add line items
    cy.get('button').contains('Agregar Item').click();
    cy.typeFormField('lineItems.0.description', 'Sesión de Terapia');
    cy.typeFormField('lineItems.0.quantity', '1');
    cy.typeFormField('lineItems.0.unitPrice', '100000');

    cy.get('button').contains('Agregar Item').click();
    cy.typeFormField('lineItems.1.description', 'Evaluación Psicológica');
    cy.typeFormField('lineItems.1.quantity', '1');
    cy.typeFormField('lineItems.1.unitPrice', '50000');

    // Verify total calculation
    cy.get('[data-test="total-amount"]').should('contain', '150000'); // 100000 + 50000
  });

  it('should apply discounts and taxes', () => {
    cy.visit('/billing/form');

    cy.typeFormField('amount', '100000');
    cy.typeFormField('tax', '19000'); // 19%
    cy.typeFormField('discount', '10000');

    // Verify final amount
    cy.get('[data-test="final-amount"]').should('contain', '109000'); // 100000 + 19000 - 10000
  });
});

describe('Billing Error Scenarios', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should validate required fields', () => {
    cy.visit('/billing/form');
    cy.get('button').contains('Guardar').click();

    cy.get('mat-error').should('be.visible');
    cy.get('mat-error').should('contain', 'requerido');
  });

  it('should prevent duplicate invoice numbers', () => {
    cy.intercept('POST', '**/billing', {
      statusCode: 409,
      body: { message: 'El número de factura ya existe' },
    });

    cy.visit('/billing/form');
    cy.fillBillingForm({
      invoiceNumber: 'INV-2024-001',
      amount: '100000',
    });
    cy.get('button').contains('Guardar').click();

    cy.get('.error-snackbar').should('contain', 'ya existe');
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('POST', '**/billing', {
      statusCode: 500,
      body: { message: 'Error del servidor' },
    });

    cy.visit('/billing/form');
    cy.fillBillingForm(testBilling);
    cy.get('button').contains('Guardar').click();

    cy.get('.error-snackbar').should('be.visible');
  });

  it('should show network error message', () => {
    cy.intercept('POST', '**/billing', { forceNetworkError: true });

    cy.visit('/billing/form');
    cy.fillBillingForm(testBilling);
    cy.get('button').contains('Guardar').click();

    cy.get('.error-snackbar').should('contain', 'Error de conexión');
  });
});

describe('Billing Reporting', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should generate billing report', () => {
    cy.visit('/billing');
    cy.get('button').contains('Generar Reporte').click();

    // Date range selection
    cy.get('input[type="date"]').first().type('2024-01-01');
    cy.get('input[type="date"]').last().type('2024-12-31');

    cy.get('button').contains('Generar').click();

    // Verify report
    cy.get('table').should('exist');
    cy.get('canvas').should('exist'); // Charts
  });

  it('should export billing data to CSV', () => {
    cy.visit('/billing');
    cy.get('button').contains('Exportar').click();
    cy.get('[role="menu"]').contains('CSV').click();

    // Verify download
    cy.readFile('cypress/downloads/billing-*.csv').should('exist');
  });
});

// Test data
const testBilling = {
  invoiceNumber: 'INV-2024-TEST-' + Date.now(),
  amount: '150000',
  currency: 'COP',
  description: 'Servicio de psicoterapia',
  paymentMethod: 'transfer',
};
