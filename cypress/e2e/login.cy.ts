/// <reference types="cypress" />

describe('Login Admin Test', () => {
  
  const email = Cypress.env("ADMIN_EMAIL");
  const password = Cypress.env("ADMIN_PASSWORD");
  const url = 'http://localhost:5173/login'

  it('Should log in successfully', () => {
    cy.visit(url);

    // Insert data
    cy.get('input[name=email]').type(email)
    cy.get('input[name=password]').type(password)
    cy.contains('Login').click();

    // Verifity successful login
    cy.get('Login').should('not.exist')

  });
});