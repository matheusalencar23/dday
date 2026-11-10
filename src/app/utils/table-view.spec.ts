import { TableViewFilter, createTableView } from './table-view';

interface Row {
  id: number;
  name: string;
  date: Date;
}

const ROWS: Row[] = [
  { id: 3, name: 'Carla', date: new Date(2023, 0, 10) },
  { id: 1, name: 'ana', date: new Date(2021, 5, 1) },
  { id: 10, name: 'Bruno', date: new Date(2024, 2, 5) },
  { id: 2, name: 'Item 10', date: new Date(2022, 1, 1) },
  { id: 4, name: 'Item 9', date: new Date(2022, 1, 2) },
];

const filter = (changes: Partial<TableViewFilter> = {}): TableViewFilter => ({
  searchTerm: '',
  page: 1,
  itemsPerPage: 10,
  sortBy: '',
  desc: false,
  ...changes,
});

describe('createTableView', () => {
  it('filtra sem diferenciar maiúsculas nas propriedades informadas', () => {
    const view = createTableView(ROWS, filter({ searchTerm: '  ANA ' }), ['name']);
    expect(view.data.map((row) => row.id)).toEqual([1]);
    expect(view.total).toBe(1);
  });

  it('ordena números numericamente', () => {
    const view = createTableView(ROWS, filter({ sortBy: 'id' }), ['name']);
    expect(view.data.map((row) => row.id)).toEqual([1, 2, 3, 4, 10]);
  });

  it('ordena textos com comparação natural e sem diferenciar maiúsculas', () => {
    const view = createTableView(ROWS, filter({ sortBy: 'name' }), ['name']);
    expect(view.data.map((row) => row.name)).toEqual([
      'ana',
      'Bruno',
      'Carla',
      'Item 9',
      'Item 10',
    ]);
  });

  it('ordena datas cronologicamente, inclusive em ordem decrescente', () => {
    const view = createTableView(ROWS, filter({ sortBy: 'date', desc: true }), ['name']);
    expect(view.data.map((row) => row.id)).toEqual([10, 3, 4, 2, 1]);
  });

  it('pagina e informa o total antes da paginação', () => {
    const view = createTableView(ROWS, filter({ sortBy: 'id', page: 2, itemsPerPage: 2 }), [
      'name',
    ]);
    expect(view.data.map((row) => row.id)).toEqual([3, 4]);
    expect(view.total).toBe(5);
    expect(view.page).toBe(2);
  });

  it('ajusta para a última página quando a solicitada não existe mais', () => {
    const view = createTableView(ROWS, filter({ sortBy: 'id', page: 9, itemsPerPage: 2 }), [
      'name',
    ]);
    expect(view.page).toBe(3);
    expect(view.data.map((row) => row.id)).toEqual([10]);
  });

  it('devolve a página 1 quando não há resultados', () => {
    const view = createTableView(ROWS, filter({ searchTerm: 'xyz', page: 4 }), ['name']);
    expect(view).toEqual({ data: [], total: 0, page: 1 });
  });

  it('não altera o array original', () => {
    const copy = [...ROWS];
    createTableView(ROWS, filter({ sortBy: 'id' }), ['name']);
    expect(ROWS).toEqual(copy);
  });
});
