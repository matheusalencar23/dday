# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Dday é um painel administrativo fictício para praticar Angular (README e textos da interface em português). **Não há backend nem API**: pagamentos, funcionários e departamentos começam com dados mock locais em `src/app/mocks/`, e todas as operações de cadastro/edição/remoção existem apenas em memória e são reiniciadas ao recarregar a página. O projeto está fixado no **Angular 15** (componentes standalone, sem NgModules) — não faça upgrade.

## Comandos

```bash
npm ci              # instalar dependências
npm start           # servidor de desenvolvimento em http://localhost:4200 (configuração development)
npm run build       # build de produção -> dist/dday
npm test            # testes unitários Karma/Jasmine (ng test)
npx ng test --watch=false --browsers=ChromeHeadless   # execução única, estilo CI
npm run cypress:run # testes e2e com Cypress (requer o servidor rodando em :4200)
```

Para rodar um único arquivo de teste: `npx ng test --include src/app/app.component.spec.ts` (ou use temporariamente `fdescribe`/`fit`). A cobertura de testes é mínima; o `app.component.spec.ts` falha atualmente por não fornecer o `TranslateService`. O e2e principal é `cypress/e2e/crud.cy.ts`.

Cypress: no terminal do VS Code a variável `ELECTRON_RUN_AS_NODE=1` impede o Cypress de abrir ("bad option: --no-sandbox"); rode com `env -u ELECTRON_RUN_AS_NODE npx cypress run`. Para não depender de um `npm start` já aberto na 4200, suba outro servidor (`npx ng serve --port 4300`) e passe `--config baseUrl=http://localhost:4300`.

O `ROADMAP.md` lista as próximas funcionalidades e o que já foi concluído; mantenha-o atualizado ao implementar itens.

O build de produção aplica os budgets definidos em `angular.json`: estilos por componente geram aviso a partir de 2kb e **falham a partir de 4kb**; o bundle inicial falha a partir de 1mb.

## Arquitetura

- **Bootstrap** (`src/main.ts`): `bootstrapApplication` com router, animations, HttpClient e ngx-translate (carrega `src/assets/i18n/{en,pt}.json` via HTTP). O locale `pt-BR` é registrado para os pipes.
- **Rotas**: `src/app/routes.ts` carrega de forma lazy `pages/internal/routes.ts`, onde `InternalPageComponent` (layout com header/sidebar) hospeda rotas filhas lazy via `loadComponent`. Os caminhos vêm do enum `DefaultRoutes` em `src/app/models/routes.ts`; os itens da sidebar são configurados separadamente em `src/app/layout/`.
- **Estado — `StudyDataService`** (`src/app/services/study-data.service.ts`): fonte única de verdade. Mantém `BehaviorSubject`s de pagamentos, funcionários e departamentos, expõe `payments$`/`employees$`/`departments$`, streams derivados (`paymentRows$` junta pagamento → funcionário → departamento; `dashboard$` calcula cards, liquidez e séries dos gráficos e reemite ao trocar o idioma) e métodos de CRUD (`saveEmployee`, `removeDepartment` etc.). Os métodos de CRUD retornam `Observable` frio com latência simulada (`simulateRequest` em `src/app/utils/`) — é preciso dar `subscribe` para a operação acontecer. Sempre altere os dados por esses métodos para que as visões derivadas continuem sincronizadas. Cascatas: remover um departamento define `departmentId` como `null` nos seus funcionários; remover um funcionário define `managerId` como `null` nos departamentos que ele gerenciava. Liquidez = `OPENING_LIQUIDITY` fixo menos o valor dos pagamentos pendentes.
- **Páginas de listagem** seguem um padrão comum: um `data-table-*-config.ts` (colunas `DataTableType` com chaves i18n no título, `dataProperty`, `sortable`, pipe opcional `currency`/`date`) renderizado pelo `dd-table` compartilhado, junto com `dd-input-search`, `dd-select` (itens por página) e `dd-pagination`. Busca, ordenação e paginação são feitas no cliente — funcionários/departamentos usam `createTableView()` em `src/app/utils/table-view.ts`; pagamentos passam por `PAYMENT_SERVICE_TOKEN` → `MockPaymentService`, fornecido no nível do componente. Ambos adicionam um atraso aleatório artificial (≤1s) para exercitar os estados de carregamento. Com `[actions]="true"`, o `dd-table` exibe a coluna editar/remover e emite `(edit)`/`(remove)` com a linha.
- **Modais**: `ModalService.open()` aceita um `TemplateRef` (renderizado em um `ViewContainerRef` que o `AppComponent` atribui a `modalService.vcr`) ou um `Type` de componente (anexado diretamente ao `document.body`) e devolve um `ModalRef` (`afterClosed$`). Componentes abertos assim recebem por injeção `MODAL_DATA` (terceiro argumento de `open`) e o próprio `ModalRef`, usado para fechar com resultado (`src/app/models/modal-ref.ts`). Para remoções, use o `ConfirmDialogComponent` passando a operação em `action`.
- **Formulários**: reactive forms tipados com `NonNullableFormBuilder`; validadores assíncronos de unicidade e o helper `controlError` (chaves `app.validation.*`) ficam em `src/app/utils/form-validators.ts`, e `whenValidated` aguarda validações pendentes antes do submit. Botões e campos usam as classes globais `dd-button`, `dd-form` e `dd-field` de `src/assets/styles/forms.scss`, o que mantém os estilos de componente dentro do budget.
- **i18n**: todo texto visível ao usuário é uma chave de tradução (`app.<área>.<chave>`) que deve existir tanto em `src/assets/i18n/en.json` quanto em `pt.json`. O `LanguageService` persiste a escolha no `localStorage` (`dday-language`); o padrão é `en`.
- **Gráficos**: ECharts via `ngx-echarts`, em `pages/internal/dashboard/components/`.

## Convenções

- Seletores de componentes compartilhados/de layout usam o prefixo `dd-` (componentes de página usam `app-`). Estilos em SCSS; fonte Poppins via Google Fonts.
- Imports usam caminhos absolutos `src/app/...`.
- `src/_redirects` é copiado para o build como fallback de SPA em hospedagem estática (estilo Netlify).
