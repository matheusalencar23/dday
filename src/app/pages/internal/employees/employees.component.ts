import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  delayWhen,
  distinctUntilChanged,
  map,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
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
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlus } from '@ng-icons/heroicons/outline';
import { ModalService } from 'src/app/services/modal.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from 'src/app/components/confirm-dialog/confirm-dialog.component';
import {
  EmployeeFormComponent,
  EmployeeFormData,
} from './components/employee-form/employee-form.component';

const MODAL_WIDTH = 'min(32rem, calc(100vw - 2rem))';

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
    NgIconComponent,
    PageTitleComponent,
    PaginationComponent,
    SelectComponent,
    TableComponent,
    TranslateModule,
  ],
  providers: [provideIcons({ heroPlus })],
})
export class EmployeesComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
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
    tap((view) => {
      this.filter = { ...this.filter, page: view.page };
      this.loading = false;
    })
  );

  searchTerm = '';
  loading = true;

  readonly itemsPerPageOptions: DefaultOption[] = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 25, label: '25' },
  ];

  constructor(
    private readonly studyData: StudyDataService,
    private readonly modalService: ModalService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    // A URL (?search=) é a fonte da busca: permite links diretos, como os da busca global.
    this.route.queryParamMap
      .pipe(
        map((params) => params.get('search') ?? ''),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((term) => {
        this.searchTerm = term;
        this.updateFilter({ searchTerm: term, page: 1 });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openForm(row?: EmployeeRow): void {
    const data: EmployeeFormData = {
      employee: row && {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        departmentId: row.departmentId,
      },
    };
    this.modalService.open(
      EmployeeFormComponent,
      {
        width: MODAL_WIDTH,
        ariaLabel: row ? 'app.employees.edit' : 'app.employees.add',
      },
      data
    );
  }

  confirmRemove(row: EmployeeRow): void {
    const managedDepartments = this.studyData.getDepartmentsManagedBy(row.id);
    const data: ConfirmDialogData = {
      title: 'app.employees.remove-title',
      message: 'app.employees.remove-message',
      messageParams: { name: row.name },
      note: managedDepartments.length ? 'app.employees.remove-manager-note' : undefined,
      noteParams: {
        departments: managedDepartments.map((department) => department.name).join(', '),
      },
      action: () => this.studyData.removeEmployee(row.id),
    };
    this.modalService.open(
      ConfirmDialogComponent,
      { width: MODAL_WIDTH, ariaLabel: 'app.employees.remove-title' },
      data
    );
  }

  filterByTerm(term: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: term || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
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
