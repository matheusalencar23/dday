import { fakeAsync, tick } from '@angular/core/testing';
import { Observable, Subject, delay, of, throwError } from 'rxjs';
import { ListController } from './list-controller';
import { LoadState } from './load-state';
import { TableView, TableViewFilter } from './table-view';

type View = TableView<string>;

const view = (page = 1, data = ['a']): View => ({ data, total: data.length, page });

describe('ListController', () => {
  let refresh$: Subject<void>;
  let states: Array<LoadState<View>>;

  const create = (fetch: (filter: TableViewFilter) => Observable<View>) => {
    const controller = new ListController(fetch, refresh$);
    controller.state$.subscribe((state) => states.push(state));
    return controller;
  };

  beforeEach(() => {
    refresh$ = new Subject<void>();
    states = [];
  });

  it('carrega com o filtro padrão e emite loading → success', () => {
    const fetch = jasmine.createSpy('fetch').and.returnValue(of(view()));
    create(fetch);

    expect(fetch).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ page: 1, itemsPerPage: 5, searchTerm: '', sortBy: '' })
    );
    expect(states.map((state) => state.status)).toEqual(['loading', 'success']);
  });

  it('cancela a requisição anterior quando o filtro muda (switchMap)', fakeAsync(() => {
    const fetch = jasmine
      .createSpy('fetch')
      .and.callFake((filter: TableViewFilter) => of(view(1, [filter.searchTerm])).pipe(delay(100)));
    const controller = create(fetch);

    controller.update({ searchTerm: 'ana' });
    tick(100);

    const successes = states.filter((state) => state.status === 'success');
    expect(successes.length).toBe(1);
    expect((successes[0] as { data: View }).data.data).toEqual(['ana']);
  }));

  it('alterna a direção ao ordenar pela mesma coluna e volta para a página 1', () => {
    const controller = create(() => of(view()));
    controller.update({ page: 3 });

    controller.order('name');
    expect(controller.filter).toEqual(jasmine.objectContaining({ sortBy: 'name', desc: false, page: 1 }));
    controller.order('name');
    expect(controller.filter.desc).toBeTrue();
    controller.order('email');
    expect(controller.filter).toEqual(jasmine.objectContaining({ sortBy: 'email', desc: false }));
  });

  it('adota a página ajustada pelo servidor', () => {
    const controller = create((filter) => of(view(Math.min(filter.page, 2))));
    controller.update({ page: 5 });
    expect(controller.filter.page).toBe(2);
  });

  it('recarrega quando refresh$ emite e quando o usuário tenta novamente', () => {
    const fetch = jasmine.createSpy('fetch').and.returnValue(of(view()));
    const controller = create(fetch);

    refresh$.next();
    controller.retry();

    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('expõe o erro sem encerrar o stream, permitindo nova tentativa', () => {
    let fail = true;
    const controller = create(() => (fail ? throwError(() => new Error('503')) : of(view())));
    expect(states[states.length - 1].status).toBe('error');

    fail = false;
    controller.retry();
    expect(states[states.length - 1].status).toBe('success');
  });
});
