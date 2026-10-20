import { PaginatedResponse } from '../models/response';

export interface TableViewFilter {
  searchTerm: string;
  page: number;
  itemsPerPage: number;
  sortBy: string;
  desc: boolean;
}

export function createTableView<T extends object>(
  source: T[],
  filter: TableViewFilter,
  searchableProperties: Array<keyof T>
): PaginatedResponse<T> {
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
  const start = (filter.page - 1) * filter.itemsPerPage;
  rows = rows.slice(start, start + filter.itemsPerPage);

  return { data: rows, total };
}
