describe('Feedback ao usuário', () => {
  beforeEach(() => {
    cy.visit('/employees?search=Tiago', {
      onBeforeLoad: (window) => window.localStorage.setItem('dday-language', 'pt'),
    });
    cy.contains('td', 'Tiago Moreira').should('exist');
  });

  it('confirma a edição com um toast', () => {
    cy.get('button[aria-label="Editar Tiago Moreira"]').click();
    cy.get('#employee-role').clear().type('General Counsel');
    cy.contains('button', 'Salvar alterações').click();

    cy.get('dd-toast-container').should('contain', 'Alterações em Tiago Moreira salvas.');
    cy.contains('td', 'General Counsel').should('exist');
  });

  it('desfaz uma remoção pelo toast, restaurando também as cascatas', () => {
    cy.get('button[aria-label="Remover Tiago Moreira"]').click();
    cy.get('dd-confirm-dialog').contains('button', 'Remover').click();
    cy.contains('Nenhum registro para exibir').should('exist');

    cy.get('dd-toast-container .toast')
      .should('contain', 'Funcionário Tiago Moreira removido.')
      .contains('button', 'Desfazer')
      .click();

    cy.get('dd-toast-container').should('contain', 'Tiago Moreira foi restaurado.');
    cy.contains('td', 'Tiago Moreira').should('exist');

    // A cascata também foi revertida: ele volta a ser responsável pelo Legal
    cy.visit('/departments?search=Legal');
    cy.contains('tr', 'Legal').should('contain', 'Tiago Moreira');
  });

  it('fecha o toast pelo botão e o anuncia numa região aria-live', () => {
    cy.get('dd-toast-container section').should('have.attr', 'aria-live', 'polite');
    cy.get('button[aria-label="Editar Tiago Moreira"]').click();
    cy.contains('button', 'Salvar alterações').click();

    cy.get('dd-toast-container .toast').should('have.length', 1);
    cy.get('button[aria-label="Fechar mensagem"]').click();
    cy.get('dd-toast-container .toast').should('not.exist');
  });
});
