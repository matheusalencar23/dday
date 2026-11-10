import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  map,
  merge,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { LoadState, toLoadState } from './load-state';
import { TableView, TableViewFilter } from './table-view';

const DEFAULT_FILTER: TableViewFilter = {
  searchTerm: '',
  page: 1,
  itemsPerPage: 5,
  sortBy: '',
  desc: false,
};

/**
 * Estado de uma listagem paginada no servidor: guarda o filtro, refaz a
 * requisição quando ele muda (cancelando a anterior via `switchMap`), quando
 * `refresh$` emite ou quando o usuário pede para tentar novamente.
 */
export class ListController<T> {
  private readonly filterChanges: BehaviorSubject<TableViewFilter>;
  private readonly retries = new Subject<void>();
  readonly state$: Observable<LoadState<TableView<T>>>;

  constructor(
    fetch: (filter: TableViewFilter) => Observable<TableView<T>>,
    refresh$: Observable<unknown>,
    initial: Partial<TableViewFilter> = {}
  ) {
    this.filterChanges = new BehaviorSubject({ ...DEFAULT_FILTER, ...initial });
    const reloads = merge(refresh$, this.retries).pipe(startWith(null));

    this.state$ = combineLatest([this.filterChanges, reloads]).pipe(
      map(([filter]) => filter),
      switchMap((filter) => fetch(filter).pipe(toLoadState())),
      tap((state) => {
        // O servidor pode ajustar a página (ex.: último item da página removido).
        if (state.status === 'success' && state.data.page !== this.filter.page) {
          this.filterChanges.value.page = state.data.page;
        }
      })
    );
  }

  get filter(): TableViewFilter {
    return this.filterChanges.value;
  }

  update(changes: Partial<TableViewFilter>): void {
    this.filterChanges.next({ ...this.filter, ...changes });
  }

  /** Alterna a direção ao reordenar pela mesma coluna; volta para a primeira página. */
  order(sortBy: string): void {
    this.update({
      sortBy,
      desc: this.filter.sortBy === sortBy ? !this.filter.desc : false,
      page: 1,
    });
  }

  retry(): void {
    this.retries.next();
  }
}
