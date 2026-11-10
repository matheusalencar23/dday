import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import {
  Department,
  DepartmentInput,
  DepartmentRow,
} from '../pages/internal/departments/models/department';
import { TableView, TableViewFilter } from '../utils/table-view';
import { API_PREFIX, Availability, Option } from './api.models';
import { DataChangesService } from './data-changes.service';
import { listParams, retryTransient } from './http-helpers';

const URL = `${API_PREFIX}/departments`;

@Injectable({ providedIn: 'root' })
export class DepartmentsApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly changes: DataChangesService,
  ) {}

  list(filter: TableViewFilter): Observable<TableView<DepartmentRow>> {
    return this.http
      .get<TableView<DepartmentRow>>(URL, { params: listParams(filter) })
      .pipe(retryTransient());
  }

  options(): Observable<Option[]> {
    return this.http.get<Option[]>(`${URL}/options`).pipe(retryTransient());
  }

  isNameAvailable(name: string, ignoreId?: number): Observable<boolean> {
    let params = new HttpParams().set('name', name);
    if (ignoreId) params = params.set('ignoreId', ignoreId);
    return this.http
      .get<Availability>(`${URL}/name-availability`, { params })
      .pipe(map((response) => response.available));
  }

  save(input: DepartmentInput, id?: number): Observable<Department> {
    const request = id
      ? this.http.put<Department>(`${URL}/${id}`, input)
      : this.http.post<Department>(URL, input);
    return request.pipe(tap(() => this.changes.notify('departments')));
  }

  remove(id: number): Observable<void> {
    return this.http
      .delete<void>(`${URL}/${id}`)
      .pipe(tap(() => this.changes.notify('departments')));
  }
}
