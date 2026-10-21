import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, delayWhen, map, tap, timer } from 'rxjs';
import { InputSearchComponent } from 'src/app/components/input-search/input-search.component';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { SelectComponent } from 'src/app/components/select/select.component';
import { DefaultOption } from 'src/app/components/select/models/options';
import { TableComponent } from 'src/app/components/table/table.component';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';
import { TableViewFilter, createTableView } from 'src/app/utils/table-view';
import { StudyDataService } from 'src/app/services/study-data.service';
import { PaymentStatus } from '../payment/models/payment-status.enum';
import { Department } from '../departments/models/department';
import { Employee } from './models/employee';
import { TABLE_EMPLOYEES_CONFIG } from './data-table-employees-config';

type EmployeeRow = Employee & {
  department: string;
  paymentCount: number;
  pendingAmount: number;
};

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputSearchComponent,
    LoadingSpinnerComponent,
    PageTitleComponent,
    PaginationComponent,
    SelectComponent,
    TableComponent,
    TranslateModule,
  ],
})
export class EmployeesComponent {
  filter: TableViewFilter = {
    searchTerm: '',
    page: 1,
    itemsPerPage: 5,
    sortBy: '',
    desc: false,
  };
  private readonly filterChanges = new BehaviorSubject<TableViewFilter>(this.filter);
  readonly tableConfig = TABLE_EMPLOYEES_CONFIG;
  readonly employees$ = combineLatest([
    this.studyData.employees$,
    this.studyData.departments$,
    this.studyData.payments$,
    this.filterChanges,
  ]).pipe(
    map(([employees, departments, payments, filter]) => {
      const rows = employees.map((employee) => ({
        ...employee,
        department: this.departmentName(employee.departmentId, departments),
        paymentCount: payments.filter((payment) => payment.employeeId === employee.id).length,
        pendingAmount: payments
          .filter(
            (payment) =>
              payment.employeeId === employee.id && payment.status === PaymentStatus.PENDING
          )
          .reduce((total, payment) => total + payment.amount, 0),
      } satisfies EmployeeRow));
      return createTableView(rows, filter, ['name', 'email', 'role', 'department']);
    }),
    delayWhen(() => timer(Math.random() * 1000)),
    tap(() => (this.loading = false))
  );

  searchTerm = '';
  loading = true;

  readonly itemsPerPageOptions: DefaultOption[] = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 25, label: '25' },
  ];

  constructor(private readonly studyData: StudyDataService) {}

  filterByTerm(term: string): void {
    this.searchTerm = term;
    this.updateFilter({ searchTerm: term, page: 1 });
  }

  showEmployees(): void {
    this.updateFilter({ page: 1 });
  }

  order(sortBy: string): void {
    this.updateFilter({
      sortBy,
      desc: this.filter.sortBy === sortBy ? !this.filter.desc : false,
      page: 1,
    });
  }

  pagination(event: { page: number }): void {
    this.updateFilter({ page: event.page });
  }

  private updateFilter(changes: Partial<TableViewFilter>): void {
    this.loading = true;
    this.filter = { ...this.filter, ...changes };
    this.filterChanges.next(this.filter);
  }

  private departmentName(id: number | null, departments: Department[]): string {
    return departments.find((department) => department.id === id)?.name ?? '—';
  }
}
