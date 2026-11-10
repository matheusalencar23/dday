describe('Backend simulado', () => {
  it('exibe erro quando a API falha e se recupera ao tentar novamente', () => {
    cy.visit('/employees', {
      onBeforeLoad: (window) => window.localStorage.setItem('dday-language', 'pt'),
    });
    cy.get('dd-table tbody tr').should('have.length', 5);

    // Liga a simulação de instabilidade pelo modal "Sobre"
    const toggleFailures = (enabled: boolean) => {
      cy.get('button[aria-label="Sobre o projeto"]').click();
      const toggle = cy.contains('label', 'Simular instabilidade de rede').find('input');
      if (enabled) toggle.should('not.be.checked').check();
      else toggle.should('be.checked').uncheck();
      cy.get('dd-about-dialog').contains('button', 'Fechar').click();
      cy.get('dd-about-dialog').should('not.exist');
    };
    toggleFailures(true);

    // Math.random = 0 faz toda requisição cair nos 30% de falha (inclusive a nova tentativa automática)
    cy.window().then((window) => cy.stub(window.Math, 'random').returns(0).as('random'));
    cy.get('.filter dd-input-search input').type('Ana');
    cy.get('dd-error-state', { timeout: 8000 }).should(
      'contain',
      'Não foi possível carregar os dados',
    );

    cy.get('@random').invoke('restore');
    toggleFailures(false);
    cy.contains('dd-error-state button', 'Tentar novamente').click();
    cy.contains('td', 'Ana Costa').should('exist');
    cy.get('dd-error-state').should('not.exist');
  });

  it('a simulação de falhas não é salva no navegador', () => {
    cy.visit('/dashboard');
    cy.get('button[aria-label="About the project"]').click();
    cy.get('dd-about-dialog input[type="checkbox"]').check();
    cy.reload();
    cy.get('button[aria-label="About the project"]').click();
    cy.get('dd-about-dialog input[type="checkbox"]').should('not.be.checked');
    cy.window().then((window) => {
      const keys = Object.keys(window.localStorage);
      expect(keys.filter((key) => key !== 'dday-language')).to.be.empty;
    });
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
