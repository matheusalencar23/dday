import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Employee, EmployeeInput, EmployeeRow } from '../pages/internal/employees/models/employee';
import { TableView, TableViewFilter } from '../utils/table-view';
import { API_PREFIX, Availability, Option } from './api.models';
import { DataChangesService } from './data-changes.service';
import { listParams, retryTransient } from './http-helpers';

const URL = `${API_PREFIX}/employees`;

@Injectable({ providedIn: 'root' })
export class EmployeesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly changes: DataChangesService,
  ) {}

  list(filter: TableViewFilter): Observable<TableView<EmployeeRow>> {
    return this.http
      .get<TableView<EmployeeRow>>(URL, { params: listParams(filter) })
      .pipe(retryTransient());
  }

  options(): Observable<Option[]> {
    return this.http.get<Option[]>(`${URL}/options`).pipe(retryTransient());
  }

  isEmailAvailable(email: string, ignoreId?: number): Observable<boolean> {
    let params = new HttpParams().set('email', email);
    if (ignoreId) params = params.set('ignoreId', ignoreId);
    return this.http
      .get<Availability>(`${URL}/email-availability`, { params })
      .pipe(map((response) => response.available));
  }

  save(input: EmployeeInput, id?: number): Observable<Employee> {
    const request = id
      ? this.http.put<Employee>(`${URL}/${id}`, input)
      : this.http.post<Employee>(URL, input);
    return request.pipe(tap(() => this.changes.notify('employees')));
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`).pipe(tap(() => this.changes.notify('employees')));
  }
}
