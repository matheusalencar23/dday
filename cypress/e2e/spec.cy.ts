describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.get('dd-logo').should('exist');
  });
});
