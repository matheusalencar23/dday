import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { NAVIGATION_ITEMS } from '../layout/navigation-items';
import { DefaultRoutes } from '../models/routes';
import { simulateRequest } from '../utils/simulate-request';
import { StudyDataService } from './study-data.service';

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

const MAX_RESULTS_PER_GROUP = 5;
const SEARCH_LATENCY = { min: 120, variation: 250 };

/** Normaliza para comparação: minúsculas e sem acentos. */
function normalize(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase().trim();
}

@Injectable({ providedIn: 'root' })
export class GlobalSearchService {
  constructor(
    private readonly studyData: StudyDataService,
    private readonly translateService: TranslateService
  ) {}

  /** Busca simulada no "servidor" por páginas, funcionários e departamentos. */
  search(term: string): Observable<SearchResultGroup[]> {
    return simulateRequest(() => this.searchNow(term), SEARCH_LATENCY);
  }

  private searchNow(term: string): SearchResultGroup[] {
    const query = normalize(term);
    const matches = (...values: Array<string | undefined>) =>
      values.some((value) => value && normalize(value).includes(query));

    const pages: SearchResult[] = NAVIGATION_ITEMS.filter(
      (item) => !query || matches(this.translateService.instant(item.label))
    ).map((item) => ({
      type: 'page',
      id: item.routerLink,
      label: item.label,
      icon: item.icon,
      route: `/${item.routerLink}`,
    }));

    if (!query) {
      return [{ type: 'page', titleKey: 'app.search.pages', results: pages }];
    }

    const { employees, departments } = this.studyData.getSnapshot();
    const departmentNames = new Map(departments.map((item) => [item.id, item.name]));

    const employeeResults: SearchResult[] = employees
      .filter((employee) => matches(employee.name, employee.email, employee.role))
      .slice(0, MAX_RESULTS_PER_GROUP)
      .map((employee) => ({
        type: 'employee',
        id: String(employee.id),
        label: employee.name,
        description: [employee.role, departmentNames.get(employee.departmentId ?? -1)]
          .filter(Boolean)
          .join(' · '),
        icon: 'heroUserSolid',
        route: `/${DefaultRoutes.EMPLOYEES}`,
        queryParams: { search: employee.name },
      }));

    const departmentResults: SearchResult[] = departments
      .filter((department) => matches(department.name, department.description))
      .slice(0, MAX_RESULTS_PER_GROUP)
      .map((department) => ({
        type: 'department',
        id: String(department.id),
        label: department.name,
        description: department.description,
        icon: 'heroUserGroupSolid',
        route: `/${DefaultRoutes.DEPARTMENTS}`,
        queryParams: { search: department.name },
      }));

    const groups: SearchResultGroup[] = [
      { type: 'page', titleKey: 'app.search.pages', results: pages },
      { type: 'employee', titleKey: 'app.search.employees', results: employeeResults },
      { type: 'department', titleKey: 'app.search.departments', results: departmentResults },
    ];
    return groups.filter((group) => group.results.length);
  }
}
