describe('Backend simulado', () => {
  it('exibe erro quando a API falha e se recupera ao tentar novamente', () => {
    cy.visit('/employees', {
      onBeforeLoad: (window) => {
        window.localStorage.setItem('dday-language', 'pt');
        window.localStorage.setItem('dday-simulate-failures', 'true');
        window.localStorage.setItem('dday-failure-rate', '1');
      },
    });

    // A leitura é repetida uma vez automaticamente antes de mostrar o erro
    cy.get('dd-error-state', { timeout: 8000 }).should('contain', 'Não foi possível carregar os dados');

    // Desliga a simulação pelo modal "Sobre" e tenta novamente
    cy.get('button[aria-label="Sobre o projeto"]').click();
    cy.contains('label', 'Simular instabilidade de rede').find('input').should('be.checked').uncheck();
    cy.get('dd-about-dialog').contains('button', 'Fechar').click();
    cy.get('dd-about-dialog').should('not.exist');

    cy.contains('dd-error-state button', 'Tentar novamente').click();
    cy.get('dd-table tbody tr').should('have.length', 5);
    cy.get('dd-error-state').should('not.exist');
  });

  it('valida a unicidade consultando a API e salva a edição', () => {
    cy.visit('/departments', {
      onBeforeLoad: (window) => window.localStorage.setItem('dday-language', 'pt'),
    });
    cy.get('button[aria-label="Editar Finance"]').click();
    // "Product" já existe: a validação assíncrona consulta /api/departments/name-availability
    cy.get('#department-name').clear().type('Product');
    cy.get('#department-name-status', { timeout: 4000 }).should('contain', 'Já existe');
    cy.get('#department-name').clear().type('Finance & Payroll');
    cy.contains('button', 'Salvar alterações').click();
    cy.get('dd-department-form').should('not.exist');
    cy.contains('td', 'Finance & Payroll').should('exist');
  });
});
