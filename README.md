# Dday

Painel administrativo fictício para praticar Angular e interfaces de gestão. Não há servidor real: um `HttpInterceptor` simula uma API REST (`/api/*`) com dados fictícios em memória, latência, códigos HTTP e falhas opcionais. Os serviços usam `HttpClient` normalmente, então trocar por uma API de verdade é só remover o interceptor. Cadastros e alterações são reiniciados ao recarregar a página. A interface usa Poppins pelo Google Fonts.

## Funcionalidades

- Dashboard com indicadores e gráficos calculados a partir dos pagamentos mock.
- Pagamentos com busca, ordenação e paginação feitas no servidor simulado.
- Funcionários com cadastro, edição e remoção; departamentos podem ser associados a funcionários.
- Departamentos com cadastro, edição, remoção e contagem de funcionários. Ao remover um departamento, seus funcionários ficam sem associação.
- Liquidez calculada a partir do saldo inicial fictício e dos pagamentos pendentes.
- Busca global (`Ctrl+K`), central de notificações e estados de carregamento/erro com nova tentativa.
- Modo "instabilidade de rede" (no modal Sobre) que faz 30% das requisições falharem.
- Interface em português e inglês, com navegação responsiva e controles acessíveis por teclado.

## Executar localmente

O projeto permanece em Angular 15. Requer Node.js compatível com essa versão.

```bash
npm ci
npm start
```

Abra <http://localhost:4200/>. Para gerar a versão de produção:

```bash
npm run build
```

## Organização

- `src/app/api/fake-backend`: backend simulado (interceptor, rotas e banco em memória).
- `src/app/api`: serviços HTTP consumidos pelas telas.
- `src/app/mocks`: conjuntos de dados iniciais.
- `src/app/pages/internal`: dashboard, pagamentos, funcionários, departamentos e liquidez.
- `src/assets/i18n`: textos em português e inglês.

## Evoluções futuras

Veja o [ROADMAP.md](ROADMAP.md).

## Tecnologias

Angular 15, TypeScript, RxJS, SCSS, ngx-translate, ECharts e Cypress.
