# Dday

Painel administrativo fictício para praticar Angular e interfaces de gestão. O projeto não se conecta a APIs: os pagamentos vêm de dados locais em `src/app/mocks/payment.ts`, e os gráficos usam valores fixos ou gerados no navegador.

## Estado atual

- Angular 15 com componentes standalone, rotas carregadas sob demanda e estilos SCSS.
- Dashboard com cartões e gráficos de solicitações e liquidez.
- Pagamentos com busca por nome, ordenação, seleção do tamanho da página e paginação, usando um serviço mock.
- Menu lateral, cabeçalho e modal de seleção de idioma (português e inglês).
- As telas de funcionários, departamentos e liquidez ainda são estruturas iniciais, sem fluxos de gestão.

## Executar localmente

Requer Node.js e npm compatíveis com as dependências do Angular 15.

```bash
npm ci
npm start
```

Abra <http://localhost:4200/>. Para gerar a versão de produção:

```bash
npm run build
```

## Organização

- `src/app/pages/internal`: páginas do painel e rotas internas.
- `src/app/pages/internal/payment`: listagem, filtros e serviço de pagamentos fictícios.
- `src/app/mocks`: dados locais usados pela aplicação.
- `src/assets/i18n`: textos em português e inglês.

## Próximas evoluções sugeridas

1. Completar funcionários e departamentos com dados locais, formulários e operações de criar, editar e remover.
2. Fazer a tela de liquidez explorar o mesmo conjunto de dados que alimenta os gráficos do dashboard.
3. Centralizar os dados mock e derivar cartões e gráficos deles para manter os números coerentes entre telas.
4. Revisar acessibilidade, responsividade e textos para que todas as páginas usem as traduções existentes.
5. Atualizar Angular e dependências em uma etapa própria, verificando compatibilidade antes de migrar a aplicação.

## Tecnologias

Angular 15, TypeScript, RxJS, SCSS, ngx-translate e ECharts.
