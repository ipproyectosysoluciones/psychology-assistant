/**
 * ES: Comandos personalizados para pruebas e2e
 * EN: Custom commands for e2e tests
 */

// Login helper
Cypress.Commands.add(
  'login',
  (email = 'test@example.com', password = 'password123') => {
    cy.visit('/auth/login', { failOnStatusCode: false });
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  },
);

// Form field helper
Cypress.Commands.add('typeFormField', (fieldName, value) => {
  cy.get(`input[name="${fieldName}"], select[name="${fieldName}"]`)
    .first()
    .type(value);
});

// Fill patient form
Cypress.Commands.add('fillPatientForm', (data) => {
  cy.typeFormField('idType', data.idType);
  cy.typeFormField('idNumber', data.idNumber);
  cy.typeFormField('dateOfBirth', data.dateOfBirth);
  cy.typeFormField('gender', data.gender);
  cy.typeFormField('address', data.address);
  cy.typeFormField('phone', data.phone);
});

// Fill billing form
Cypress.Commands.add('fillBillingForm', (data) => {
  if (data.invoiceNumber) {
    cy.typeFormField('invoiceNumber', data.invoiceNumber);
  }
  if (data.amount) {
    cy.typeFormField('amount', data.amount);
  }
  if (data.currency) {
    cy.typeFormField('currency', data.currency);
  }
  if (data.description) {
    cy.typeFormField('description', data.description);
  }
  if (data.paymentMethod) {
    cy.typeFormField('paymentMethod', data.paymentMethod);
  }
});

// Fill appointment form
Cypress.Commands.add('fillAppointmentForm', (data) => {
  if (data.date) {
    cy.typeFormField('date', data.date);
  }
  if (data.time) {
    cy.typeFormField('time', data.time);
  }
  if (data.description) {
    cy.typeFormField('description', data.description);
  }
  if (data.duration) {
    cy.typeFormField('duration', data.duration);
  }
});

// Wait for snackbar
Cypress.Commands.add('waitForSnackbar', (type = 'success', timeout = 5000) => {
  const selector = `.${type}-snackbar`;
  cy.get(selector, { timeout }).should('be.visible');
  cy.get(selector).should('not.exist', { timeout });
});

// Check authorization
Cypress.Commands.add('checkAuthorized', (url) => {
  cy.visit(url);
  cy.url().should('include', url);
});

// Check unauthorized redirect
Cypress.Commands.add('checkUnauthorized', (url) => {
  cy.visit(url, { failOnStatusCode: false });
  cy.url().should('include', '/auth/login');
});

// Declare types for custom commands
declare namespace Cypress {
  interface Chainable {
    login(email?: string, password?: string): Chainable<void>;
    typeFormField(fieldName: string, value: string): Chainable<void>;
    fillPatientForm(data: any): Chainable<void>;
    fillBillingForm(data: any): Chainable<void>;
    fillAppointmentForm(data: any): Chainable<void>;
    waitForSnackbar(type?: string, timeout?: number): Chainable<void>;
    checkAuthorized(url: string): Chainable<void>;
    checkUnauthorized(url: string): Chainable<void>;
  }
}
