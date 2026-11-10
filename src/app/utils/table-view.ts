import { PaginatedResponse } from '../models/response';

export interface TableViewFilter {
  searchTerm: string;
  page: number;
  itemsPerPage: number;
  sortBy: string;
  desc: boolean;
}

export interface TableView<T> extends PaginatedResponse<T> {
  /** Página efetivamente exibida (ajustada se a solicitada ficou fora do intervalo). */
  page: number;
}

export function createTableView<T extends object>(
  source: T[],
  filter: TableViewFilter,
  searchableProperties: Array<keyof T>
): TableView<T> {
  const searchTerm = filter.searchTerm.trim().toLocaleLowerCase();
  let rows = searchTerm
    ? source.filter((row) =>
        searchableProperties.some((property) =>
          String(row[property] ?? '').toLocaleLowerCase().includes(searchTerm)
        )
      )
    : [...source];

  if (filter.sortBy && rows.length) {
    const direction = filter.desc ? -1 : 1;
    rows = [...rows].sort((first, second) => {
      const property = filter.sortBy as keyof T;
      const firstValue = first[property];
      const secondValue = second[property];
      const result =
        typeof firstValue === 'number' && typeof secondValue === 'number'
          ? firstValue - secondValue
          : String(firstValue ?? '').localeCompare(String(secondValue ?? ''), undefined, {
              numeric: true,
              sensitivity: 'base',
            });
      return result * direction;
    });
  }

  const total = rows.length;
  const lastPage = Math.max(1, Math.ceil(total / filter.itemsPerPage));
  const page = Math.min(Math.max(1, filter.page), lastPage);
  const start = (page - 1) * filter.itemsPerPage;
  rows = rows.slice(start, start + filter.itemsPerPage);

  return { data: rows, total, page };
}
