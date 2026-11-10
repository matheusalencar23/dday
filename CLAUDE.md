# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Dday é um painel administrativo fictício para praticar Angular (README e textos da interface em português). **Não há servidor real**: um `HttpInterceptor` (backend simulado) atende as chamadas para `/api/*` a partir de dados mock em `src/app/mocks/`, com latência simulada. As alterações existem apenas em memória e são reiniciadas ao recarregar a página. O projeto está fixado no **Angular 15** (componentes standalone, sem NgModules) — não faça upgrade.

## Comandos

```bash
npm ci              # instalar dependências
npm start           # servidor de desenvolvimento em http://localhost:4200 (configuração development)
npm run build       # build de produção -> dist/dday
npm test            # testes unitários Karma/Jasmine (ng test, modo watch)
npm run test:ci     # execução única em Chrome headless com cobertura (usado no CI)
npm run cypress:run # testes e2e com Cypress (requer o servidor rodando em :4200)
npm run lint        # ESLint (@angular-eslint 15)
npm run format      # Prettier; format:check só verifica (usado no CI)
```

Para rodar um único arquivo de teste: `npx ng test --include src/app/app.component.spec.ts` (ou use temporariamente `fdescribe`/`fit`). Os specs unitários ficam ao lado do código (`*.spec.ts`); para testar o backend simulado, use `provideHttpClient(withInterceptors([fakeBackendInterceptor]))` + `fakeAsync`/`tick` para vencer a latência (veja `fake-backend.interceptor.spec.ts`). Os e2e ficam em `cypress/e2e/` (`crud`, `header`, `fake-backend`); para forçar falhas no e2e, ligue o interruptor no modal Sobre e faça stub de `Math.random` para 0.

CI: `.github/workflows/ci.yml` (Node 24) roda `lint`, `format:check`, `test:ci` e `build` e, em paralelo, o Cypress via `cypress-io/github-action`. O `package-lock.json` é versionado e o `package.json` declara `allowScripts` (npm 11): ao adicionar dependência com script de instalação necessário, aprove com `npm install-scripts approve <pkg>`.

Cypress: no terminal do VS Code a variável `ELECTRON_RUN_AS_NODE=1` impede o Cypress de abrir ("bad option: --no-sandbox"); rode com `env -u ELECTRON_RUN_AS_NODE npx cypress run`. Para não depender de um `npm start` já aberto na 4200, suba outro servidor (`npx ng serve --port 4300`) e passe `--config baseUrl=http://localhost:4300`.

O `ROADMAP.md` lista as próximas funcionalidades e o que já foi concluído; mantenha-o atualizado ao implementar itens.

O build de produção aplica os budgets definidos em `angular.json`: estilos por componente geram aviso a partir de 2kb e **falham a partir de 4kb**; o bundle inicial falha a partir de 1mb.

## Arquitetura

- **Bootstrap** (`src/main.ts`): `bootstrapApplication` com router, animations, HttpClient e ngx-translate (carrega `src/assets/i18n/{en,pt}.json` via HTTP). O locale `pt-BR` é registrado para os pipes.
- **Rotas**: `src/app/routes.ts` carrega de forma lazy `pages/internal/routes.ts`, onde `InternalPageComponent` (layout com header/sidebar) hospeda rotas filhas lazy via `loadComponent`. Os caminhos vêm do enum `DefaultRoutes` em `src/app/models/routes.ts`; os itens da sidebar são configurados separadamente em `src/app/layout/`.
- **Backend simulado** (`src/app/api/fake-backend/`): `fakeBackendInterceptor` (funcional, registrado com `withInterceptors` no `main.ts`) responde a `/api/*` e deixa passar o resto (ex.: os JSON de i18n). Ele casa método + regex de rota com os handlers em `handlers/`, aplica latência, opcionalmente falha com 503 e clona corpo de requisição e resposta via JSON — **datas chegam como string ISO** e os serviços de API as convertem (`parsePaymentRow`). Handlers retornam `ok/created/noContent` ou lançam `fail(status, code, message, field?)` (helpers em `http-utils.ts`); erros de validação usam 422/409 com `field`. O estado vive no `FakeDatabase`, que concentra as regras de cascata (remover departamento → funcionários com `departmentId: null`; remover funcionário → departamentos com `managerId: null`) e os cálculos (linhas agregadas, liquidez = `OPENING_LIQUIDITY` − pendentes). A UI nunca acessa o `FakeDatabase` diretamente. `FakeBackendConfig` controla latência e a simulação de falhas (30%, ligada pelo modal "Sobre"; não é persistida).
- **Cliente da API** (`src/app/api/`): `EmployeesApiService`, `DepartmentsApiService`, `PaymentsApiService` (implementa `PaymentService`, ligado via `PAYMENT_SERVICE_TOKEN`) e `ReportsApiService` (dashboard, liquidez, notificações, busca). Leituras usam `retryTransient()` (uma nova tentativa em status 0/5xx). Escritas chamam `DataChangesService.notify()`; telas, notificações e dashboard escutam `changes$` e recarregam — ao criar uma escrita nova, notifique para manter tudo sincronizado. Contratos compartilhados em `api.models.ts`.
- **Páginas de listagem** seguem um padrão comum: um `data-table-*-config.ts` (colunas `DataTableType` com chaves i18n no título, `dataProperty`, `sortable`, pipe opcional `currency`/`date`) renderizado pelo `dd-table` compartilhado, junto com `dd-input-search`, `dd-select` (itens por página) e `dd-pagination`. Busca, ordenação e paginação são feitas no servidor simulado (os handlers usam `createTableView()` de `src/app/utils/table-view.ts`). Funcionários e departamentos usam o `ListController` (`src/app/utils/list-controller.ts`), que guarda o filtro e refaz a requisição com `switchMap` quando ele muda, quando `changes$` emite ou no retry. Telas expõem um `LoadState` (`toLoadState()` em `src/app/utils/load-state.ts`) e renderizam spinner / `dd-error-state` (com "Tentar novamente") / conteúdo conforme `state.status`. Com `[actions]="true"`, o `dd-table` exibe a coluna editar/remover e emite `(edit)`/`(remove)` com a linha.
- **Modais**: `ModalService.open()` aceita um `TemplateRef` (renderizado em um `ViewContainerRef` que o `AppComponent` atribui a `modalService.vcr`) ou um `Type` de componente (anexado diretamente ao `document.body`) e devolve um `ModalRef` (`afterClosed$`). Componentes abertos assim recebem por injeção `MODAL_DATA` (terceiro argumento de `open`) e o próprio `ModalRef`, usado para fechar com resultado (`src/app/models/modal-ref.ts`). Para remoções, use o `ConfirmDialogComponent` passando a operação em `action`.
- **Formulários**: reactive forms tipados com `NonNullableFormBuilder`. Em `src/app/utils/form-validators.ts`: `uniqueValueValidator` (debounce + consulta à API de disponibilidade), `controlError` (chaves `app.validation.*`, exibido quando o campo está `touched` ou `dirty`) e `applyServerError` (aplica 409/422 com `field` ao campo; senão devolve a mensagem geral para `.dd-alert`). `whenValidated` aguarda validações pendentes antes do submit — ele reexecuta as pendentes porque as diretivas do Angular disparam validação com `emitEvent: false`, que não emite `statusChanges` ao terminar. Botões e campos usam as classes globais `dd-button`, `dd-form` e `dd-field` de `src/assets/styles/forms.scss`, o que mantém os estilos de componente dentro do budget.
- **i18n**: todo texto visível ao usuário é uma chave de tradução (`app.<área>.<chave>`) que deve existir tanto em `src/assets/i18n/en.json` quanto em `pt.json`. O `LanguageService` persiste a escolha no `localStorage` (`dday-language`); o padrão é `en`.
- **Gráficos**: ECharts via `ngx-echarts`, em `pages/internal/dashboard/components/`.
- **Header**: a busca (`dd-command-palette`, aberta com `Ctrl+K`) usa o `GlobalSearchService`; o sino (`dd-notifications`) usa o `NotificationService`, que busca `/api/notifications` a cada `changes$` e traduz cada `id` em título/rota no cliente. Os itens de navegação ficam em `src/app/layout/navigation-items.ts`, compartilhados pela sidebar e pela busca.
- **Busca na URL**: nas telas de funcionários e departamentos o termo de busca vive em `?search=`; o campo apenas navega e a página reage a `queryParamMap`.

## Convenções

- Todos os seletores de componente usam o prefixo `dd-` (inclusive páginas e o raiz `dd-root`), exigido pelo ESLint. Estilos em SCSS; fonte Poppins via Google Fonts.
- Formatação pelo Prettier (`.prettierrc.json`: aspas simples, 100 colunas, parser `angular` para HTML). Rode `npm run format` antes de commitar; o CI falha se houver diferença. Supressões de lint só com justificativa (ex.: `TableRow` em `data-table-type.ts`).
- Imports usam caminhos absolutos `src/app/...`.
- O header é `position: fixed` com `z-index: 3` (acima das colunas fixas da tabela); a sidebar mobile usa 4/10 e o modal 11/12. Popovers do header precisam ficar dentro dessa camada.
- Em modais, marque o elemento que deve receber o foco inicial com `data-autofocus`.
- **Nada é persistido no navegador** além do idioma (`dday-language`): sem `localStorage`/`sessionStorage`/IndexedDB para dados ou preferências da aplicação.
- `src/_redirects` é copiado para o build como fallback de SPA em hospedagem estática (estilo Netlify).
