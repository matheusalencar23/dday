# Dday

Painel administrativo fictício para praticar Angular e interfaces de gestão. Não há integração com APIs. Os pagamentos, funcionários e departamentos começam com dados locais; cadastros e alterações existem apenas em memória e são reiniciados ao recarregar a página. A interface usa Poppins pelo Google Fonts.

## Funcionalidades

- Dashboard com indicadores e gráficos calculados a partir dos pagamentos mock.
- Pagamentos com busca, ordenação e paginação local.
- Funcionários com cadastro, edição e remoção; departamentos podem ser associados a funcionários.
- Departamentos com cadastro, edição, remoção e contagem de funcionários. Ao remover um departamento, seus funcionários ficam sem associação.
- Liquidez calculada a partir do saldo inicial fictício e dos pagamentos pendentes.
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

- `src/app/services/study-data.service.ts`: estado local e cálculos compartilhados.
- `src/app/mocks`: conjuntos de dados iniciais.
- `src/app/pages/internal`: dashboard, pagamentos, funcionários, departamentos e liquidez.
- `src/assets/i18n`: textos em português e inglês.

## Evoluções futuras

- Persistir os dados mock no navegador, mantendo o modo de estudo sem servidor.
- Adicionar busca, filtros e estados de confirmação/feedback às telas de gestão.
- Incluir testes para os cálculos e operações CRUD.

## Tecnologias

Angular 15, TypeScript, RxJS, SCSS, ngx-translate e ECharts.
