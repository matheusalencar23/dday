# Roadmap

Propostas para tornar o Dday mais atrativo como projeto de portfólio, mantendo as premissas atuais:

- **Sem API real**: toda "requisição" continua simulada no front-end, com atraso artificial.
- **Angular 15**: nada de upgrade. Recursos como signals e o novo control flow (`@if`/`@for`) ficam de fora; usamos o que o 15 oferece (componentes standalone, `inject()`, guards funcionais, formulários reativos tipados, interceptors).

Cada item indica **o que demonstra** para quem avalia o código. A ordem das fases é a ordem sugerida de implementação.

---

## Fase 0 — Fechar lacunas atuais

Itens que corrigem divergências entre o que o projeto promete e o que entrega. Um recrutador que abrir o README e depois a aplicação vai notar.

### 0.1 Interface de CRUD para funcionários e departamentos — ✅ concluído
O README anunciava cadastro, edição e remoção, mas nenhuma tela chamava os métodos do `StudyDataService`.

Entregue:
- Botão "Adicionar" e coluna de ações (editar/remover) no `dd-table` (`[actions]`, `(edit)`, `(remove)`), fixa à direita durante a rolagem horizontal.
- Formulários em modal com **reactive forms tipados** (`NonNullableFormBuilder`), validações síncronas e **assíncronas** (e-mail e nome de departamento únicos, simulando checagem no servidor) e mensagens traduzidas.
- `ModalService.open()` agora devolve um `ModalRef` (`afterClosed$`) e injeta dados via `MODAL_DATA`; o foco volta ao elemento de origem ao fechar.
- Diálogo de confirmação reutilizável (`dd-confirm-dialog`) que executa a operação e só fecha quando ela termina.
- Operações de CRUD retornam `Observable` com latência simulada (`simulateRequest`), com estados "Salvando..." / "Removendo...".
- Regras de cascata: remover departamento desassocia funcionários; remover funcionário deixa sem responsável os departamentos que ele gerenciava.
- Estado vazio na tabela e ajuste automático da página quando o último item de uma página é removido.
- Teste e2e cobrindo o fluxo (`cypress/e2e/crud.cy.ts`).

### 0.2 Consistência dos dados mock — ✅ concluído
- 8 dos 40 pagamentos base tinham `payrollDate` anterior à data da solicitação; foram ajustados para o dia 15 do mês seguinte, mesma regra dos pagamentos gerados.
- Os cargos (`role`) continuam sem tradução: são texto livre digitado no cadastro, então não faz sentido traduzi-los.

### 0.3 Elementos decorativos sem função — ✅ concluído
A busca, o sino e o ícone de informações do header eram apenas visuais. Todos ganharam função:
- Busca → busca global (item 2.4).
- Sino → central de notificações (item 2.5).
- Informações → modal "Sobre o Dday", com destaques técnicos, aviso de que os dados são simulados e link para o repositório.

---

## Fase 1 — Base técnica que valoriza o restante

### 1.1 Backend simulado via `HttpInterceptor` ⭐ — ✅ concluído
Entregue: interceptor funcional com rotas REST em `/api/*`, `FakeDatabase` em memória, paginação/ordenação no servidor, códigos 200/201/204/400/404/409/422/503, serialização JSON (datas como ISO), `retryTransient()`, `LoadState` + `dd-error-state` em todas as telas, `DataChangesService` para recarregar telas após escritas e interruptor "Simular instabilidade de rede" (30% de falhas) no modal Sobre. Testes em `cypress/e2e/fake-backend.cy.ts`.

Proposta original:

- Os serviços passam a usar `HttpClient` normalmente (`GET /api/employees?page=1&sort=name`, `POST /api/payments` etc.).
- Um interceptor responde a `/api/*` a partir do estado em memória, com atraso aleatório, paginação/ordenação "no servidor" e códigos HTTP reais (200, 201, 404, 409, 422).
- Taxa de erro configurável (ex.: 5%) para exercitar estados de erro, com `retry` e botão "tentar novamente".
- Trocar por uma API real seria só remover o interceptor — isso é um ótimo ponto para citar em entrevista.

**Demonstra:** interceptors, separação entre camada de dados e UI, tratamento de erro HTTP, arquitetura pronta para produção.

### 1.2 Persistência no navegador
Salvar o estado em `localStorage` (já previsto no README) com um botão "Restaurar dados de demonstração". Assim o avaliador vê suas alterações persistirem ao recarregar.

**Demonstra:** sincronização de estado, versionamento simples do schema salvo.

### 1.3 Feedback ao usuário
- Serviço de **toasts** (sucesso, erro, info) acessível (`aria-live`).
- Ação de **desfazer** após remoções ("Funcionário removido · Desfazer").
- Estados vazios e de erro consistentes em todas as listagens.

**Demonstra:** UX madura, serviços globais, acessibilidade.

### 1.4 Testes e CI
Hoje existe apenas um teste de componente (que falha: o `app.component.spec.ts` não fornece o `TranslateService`), um e2e de fumaça e os e2e de CRUD (`crud.cy.ts`) e do header (`header.cy.ts`).

- Testes unitários de `StudyDataService` (CRUD, remoção em cascata, cálculo de liquidez), `createTableView` e do interceptor fake.
- Testes de componente para formulários (validações).
- Fluxos e2e no Cypress: cadastrar funcionário, filtrar pagamentos, trocar idioma.
- GitHub Actions rodando lint, testes e build a cada push, com badge no README.
- Fixar a versão do Cypress (hoje está como `"latest"`, o que pode quebrar com Angular 15/Node).

**Demonstra:** disciplina de engenharia — um dos sinais mais valorizados por recrutadores técnicos.

### 1.5 Lint e formatação
Adicionar ESLint (`@angular-eslint` compatível com a v15) e Prettier, com script `npm run lint`.

---

## Fase 2 — Funcionalidades de destaque

### 2.1 Fluxo de aprovação de pagamentos ⭐
Transformar a lista de pagamentos em um fluxo de trabalho real:

- Criar solicitação de pagamento para um funcionário.
- Aprovar, rejeitar ou reprocessar pagamentos com erro.
- **Ações em lote** com seleção múltipla na tabela.
- Ao aprovar, a liquidez e o dashboard são atualizados em tempo real (o `StudyDataService` já é reativo).
- Bloquear aprovação quando a liquidez disponível não for suficiente.

**Demonstra:** regras de negócio, máquina de estados simples, reatividade com RxJS.

### 2.2 Filtros avançados sincronizados com a URL — 🟡 iniciado
Já feito: a busca das telas de funcionários e departamentos vive em `?search=` (a URL é a fonte da verdade).

Falta: filtros por status, departamento e intervalo de datas na tela de pagamentos, com página, ordenação e busca refletidas em **query params**. Links ficam compartilháveis e o botão "voltar" do navegador funciona.

**Demonstra:** domínio do Router, estado derivado da URL.

### 2.3 Página de detalhe do funcionário
Rota `/employees/:id` com resolver, dados do funcionário, histórico de pagamentos e um gráfico de valores ao longo do tempo. Clicar em uma linha da tabela navega para o detalhe.

**Demonstra:** rotas parametrizadas, resolvers, reaproveitamento de componentes de gráfico.

### 2.4 Busca global (command palette) — ✅ concluído
Busca do header com atalho `Ctrl+K` / `⌘K`: resultados agrupados em páginas, funcionários e departamentos, busca sem acentos, `debounceTime` + `switchMap` sobre uma busca "no servidor" com latência simulada, navegação por teclado (setas, Home/End, Enter) no padrão ARIA de combobox. Selecionar um registro abre a listagem já filtrada (`?search=`).

Possível evolução: incluir pagamentos nos resultados e ações rápidas ("Adicionar funcionário").

**Demonstra:** operadores RxJS (`debounceTime`, `switchMap`), acessibilidade de combobox, atalhos de teclado.

### 2.5 Central de notificações — ✅ concluído
O `NotificationService` deriva alertas dos dados (pagamentos com erro, pendências com folha vencida, liquidez abaixo de 50%, departamentos sem responsável, funcionários sem departamento). O contador de não lidas zera ao abrir o painel e volta quando o conteúdo de um alerta muda (ex.: ao remover o responsável de um departamento). Cada alerta leva à tela relacionada.

### 2.6 Autenticação e perfis simulados
- Tela de login com usuários de demonstração (ex.: "Admin" e "Somente leitura").
- **Guard funcional** protegendo as rotas internas.
- Diretiva estrutural `*ddHasRole` escondendo ações de edição para perfis sem permissão.
- Sessão simulada com token fake no `localStorage`, enviado pelo interceptor.

**Demonstra:** guards, diretivas customizadas, controle de acesso — temas frequentes em entrevistas.

### 2.7 Exportação de dados
Exportar a visão atual da tabela (respeitando filtros e ordenação) para CSV.

### 2.8 Dashboard interativo
- Seletor de período (mês, trimestre, ano).
- **Drill-down**: clicar em uma barra/ponto do gráfico abre os pagamentos filtrados por aquele período.

### 2.9 Projeção de liquidez
Na tela de liquidez, um gráfico de fluxo de caixa projetado pelas datas de folha (`payrollDate`) e um simulador "e se": marcar pagamentos pendentes e ver o impacto no saldo.

### 2.10 Histórico de atividades
Registro das alterações feitas na sessão (quem, o quê, quando), exibido em uma tela ou painel lateral.

---

## Fase 3 — Acabamento e apresentação

- **Tema escuro** usando as variáveis CSS já existentes em `styles.scss`, respeitando `prefers-color-scheme` e com alternância manual.
- **Desempenho**: `ChangeDetectionStrategy.OnPush` em todos os componentes e `trackBy` nas listas.
- **PWA** com `@angular/pwa` (compatível com a v15): funciona offline, o que combina com a proposta sem API.
- **Acessibilidade auditada**: `cypress-axe` nos testes e2e e meta de Lighthouse ≥ 90.
- **README de portfólio**: link da demo publicada, GIF/screenshots, decisões de arquitetura (por que o backend fake, como trocá-lo por uma API real) e badges de CI.

---

## Prioridade sugerida

| Ordem | Item | Motivo |
| --- | --- | --- |
| ✅ | 0.1, 0.2, 0.3, 1.1, 2.4 e 2.5 | Concluídos |
| 1 | 1.4 Testes e CI | Sinal de qualidade visível logo no repositório |
| 2 | 2.1 Fluxo de aprovação | Funcionalidade de negócio mais impressionante |
| 3 | 2.6 Autenticação e perfis | Cobre guards e diretivas, temas recorrentes em vagas Angular |
| 4 | 2.2 Filtros na URL e 2.3 Detalhe | Mostram domínio do Router |
| 5 | Fase 3 | Polimento final antes de divulgar |
