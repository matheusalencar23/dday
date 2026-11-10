describe('CRUD de funcionários e departamentos', () => {
  beforeEach(() => {
    cy.visit('/employees', {
      onBeforeLoad: (window) => window.localStorage.setItem('dday-language', 'pt'),
    });
  });

  it('valida, cadastra, edita e remove um funcionário', () => {
    cy.contains('button', 'Adicionar funcionário').click();
    cy.get('dd-employee-form').should('be.visible');

    // Validações: obrigatórios e e-mail já existente
    cy.contains('button', 'Salvar alterações').click();
    cy.get('#employee-name-error').should('contain', 'Campo obrigatório');
    cy.get('#employee-email').type('ana.costa@example.test');
    cy.get('#employee-email-status', { timeout: 4000 }).should('contain', 'já está em uso');

    // Cadastro
    cy.get('#employee-name').type('Zélia Teste');
    cy.get('#employee-email').clear().type('zelia.teste@example.test');
    cy.get('#employee-role').type('QA Analyst');
    cy.get('#employee-department').select('Technology');
    cy.contains('button', 'Salvar alterações').click();
    cy.get('dd-employee-form').should('not.exist');

    cy.get('.filter dd-input-search input').type('Zélia');
    cy.contains('td', 'Zélia Teste').should('exist');
    cy.contains('td', 'Technology').should('exist');

    // Edição
    cy.get('button[aria-label="Editar Zélia Teste"]').click();
    cy.get('#employee-role').clear().type('QA Lead');
    cy.contains('button', 'Salvar alterações').click();
    cy.get('dd-employee-form').should('not.exist');
    cy.contains('td', 'QA Lead').should('exist');

    // Remoção
    cy.get('button[aria-label="Remover Zélia Teste"]').click();
    cy.get('dd-confirm-dialog').should('contain', 'Zélia Teste');
    cy.get('dd-confirm-dialog').contains('button', 'Remover').click();
    cy.get('dd-confirm-dialog').should('not.exist');
    cy.contains('Nenhum registro para exibir').should('exist');
  });

  it('remove um departamento e deixa seus funcionários sem departamento', () => {
    cy.visit('/departments');
    cy.get('.filter dd-input-search input').type('Legal');
    cy.get('button[aria-label="Remover Legal"]').click();
    cy.get('dd-confirm-dialog').should('contain', 'ficam sem departamento');
    cy.get('dd-confirm-dialog').contains('button', 'Remover').click();
    cy.get('dd-confirm-dialog').should('not.exist');
    cy.contains('Nenhum registro para exibir').should('exist');

    // A navegação client-side preserva o estado em memória
    cy.get('a[href="/employees"]').click();
    cy.get('.filter dd-input-search input').type('Tiago');
    cy.contains('tr', 'Tiago Moreira').should('contain', '—');
  });
});
