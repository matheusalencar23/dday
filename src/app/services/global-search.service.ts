import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map, of } from 'rxjs';
import { SearchResponse } from '../api/api.models';
import { ReportsApiService } from '../api/reports-api.service';
import { NAVIGATION_ITEMS } from '../layout/navigation-items';
import { DefaultRoutes } from '../models/routes';

export type SearchResultType = 'page' | 'employee' | 'department';

export interface SearchResult {
  type: SearchResultType;
  id: string;
  /** Texto principal; para páginas é uma chave de tradução. */
  label: string;
  description?: string;
  icon: string;
  route: string;
  queryParams?: Params;
}

export interface SearchResultGroup {
  type: SearchResultType;
  titleKey: string;
  results: SearchResult[];
}

/** Normaliza para comparação: minúsculas e sem acentos. */
function normalize(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase().trim();
}

@Injectable({ providedIn: 'root' })
export class GlobalSearchService {
  constructor(
    private readonly api: ReportsApiService,
    private readonly translateService: TranslateService
  ) {}

  /**
   * Páginas são filtradas no cliente (seus nomes dependem do idioma);
   * funcionários e departamentos vêm da API.
   */
  search(term: string): Observable<SearchResultGroup[]> {
    const query = normalize(term);
    const pages = this.searchPages(query);
    if (!query) return of([pages]);

    return this.api.search(term).pipe(
      map((response) => [pages, ...this.toGroups(response)].filter((group) => group.results.length))
    );
  }

  private searchPages(query: string): SearchResultGroup {
    return {
      type: 'page',
      titleKey: 'app.search.pages',
      results: NAVIGATION_ITEMS.filter(
        (item) => !query || normalize(this.translateService.instant(item.label)).includes(query)
      ).map((item) => ({
        type: 'page',
        id: item.routerLink,
        label: item.label,
        icon: item.icon,
        route: `/${item.routerLink}`,
      })),
    };
  }

  private toGroups(response: SearchResponse): SearchResultGroup[] {
    return [
      {
        type: 'employee',
        titleKey: 'app.search.employees',
        results: response.employees.map((employee) => ({
          type: 'employee',
          id: String(employee.id),
          label: employee.name,
          description: [employee.role, employee.department].filter(Boolean).join(' · '),
          icon: 'heroUserSolid',
          route: `/${DefaultRoutes.EMPLOYEES}`,
          queryParams: { search: employee.name },
        })),
      },
      {
        type: 'department',
        titleKey: 'app.search.departments',
        results: response.departments.map((department) => ({
          type: 'department',
          id: String(department.id),
          label: department.name,
          description: department.description,
          icon: 'heroUserGroupSolid',
          route: `/${DefaultRoutes.DEPARTMENTS}`,
          queryParams: { search: department.name },
        })),
      },
    ];
  }
}
