const visitInPortuguese = (url: string) =>
  cy.visit(url, {
    onBeforeLoad: (window) => window.localStorage.setItem('dday-language', 'pt'),
  });

describe('Header', () => {
  describe('busca global', () => {
    beforeEach(() => visitInPortuguese('/dashboard'));

    it('abre com Ctrl+K e navega até o funcionário pelo teclado', () => {
      cy.get('body').type('{ctrl}k');
      cy.get('dd-command-palette input').should('have.focus');
      cy.contains('[role="option"]', 'Painel de controle').should('exist');

      cy.focused().type('camila');
      cy.contains('[role="group"]', 'Funcionários').should('contain', 'Camila Rocha');
      cy.get('[role="option"][aria-selected="true"]').should('contain', 'Camila Rocha');
      cy.focused().type('{enter}');

      cy.get('dd-command-palette').should('not.exist');
      cy.location('pathname').should('eq', '/employees');
      cy.location('search').should('contain', 'search=Camila');
      cy.get('.filter dd-input-search input').should('have.value', 'Camila Rocha');
      cy.get('dd-table tbody tr').should('have.length', 1).and('contain', 'Camila Rocha');
    });

    it('navega com as setas e informa quando não há resultados', () => {
      cy.contains('button', 'Pesquisar...').click();
      cy.focused().type('tech');
      cy.contains('[role="option"]', 'Technology').should('exist');
      cy.focused().type('{downarrow}');
      cy.get('[role="option"][aria-selected="true"]')
        .invoke('attr', 'id')
        .then((id) => {
          cy.focused().should('have.attr', 'aria-activedescendant', id);
        });

      cy.focused().clear().type('xyzxyz');
      cy.contains('Nenhum resultado para "xyzxyz"').should('exist');
      cy.focused().type('{esc}');
      cy.get('dd-command-palette').should('not.exist');
    });
  });

  describe('notificações', () => {
    it('lista alertas, zera o contador ao abrir e reage a mudanças nos dados', () => {
      visitInPortuguese('/employees?search=Tiago');
      cy.get('dd-notifications .badge').should('exist');

      cy.get('dd-notifications .trigger').click();
      cy.get('#notifications-panel').should('contain', 'Pagamentos com erro');
      cy.get('dd-notifications .badge').should('not.exist');
      cy.get('body').type('{esc}');
      cy.get('#notifications-panel').should('not.exist');

      // Tiago Moreira é responsável pelo departamento Legal
      cy.get('button[aria-label="Remover Tiago Moreira"]').click();
      cy.get('dd-confirm-dialog').contains('button', 'Remover').click();
      cy.get('dd-confirm-dialog').should('not.exist');

      cy.get('dd-notifications .badge').should('exist');
      cy.get('dd-notifications .trigger').click();
      cy.contains('#notifications-panel a', 'Departamentos sem responsável')
        .should('contain', 'Legal')
        .click();
      cy.location('pathname').should('eq', '/departments');
    });
  });

  describe('sobre o projeto', () => {
    it('abre o modal e devolve o foco ao fechar', () => {
      visitInPortuguese('/dashboard');
      cy.get('button[aria-label="Sobre o projeto"]').click();
      cy.get('dd-about-dialog').should('contain', 'Sobre o Dday');
      cy.focused().should('contain', 'Fechar');
      cy.focused().type('{esc}');
      cy.get('dd-about-dialog').should('not.exist');
      cy.focused().should('have.attr', 'aria-label', 'Sobre o projeto');
    });
  });
});
