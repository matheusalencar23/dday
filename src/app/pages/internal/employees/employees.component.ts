import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlus } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { DataChangesService } from 'src/app/api/data-changes.service';
import { EmployeesApiService } from 'src/app/api/employees-api.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ErrorStateComponent } from 'src/app/components/error-state/error-state.component';
import { InputSearchComponent } from 'src/app/components/input-search/input-search.component';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { DefaultOption } from 'src/app/components/select/models/options';
import { SelectComponent } from 'src/app/components/select/select.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ModalService } from 'src/app/services/modal.service';
import { ListController } from 'src/app/utils/list-controller';
import {
  EmployeeFormComponent,
  EmployeeFormData,
} from './components/employee-form/employee-form.component';
import { TABLE_EMPLOYEES_CONFIG } from './data-table-employees-config';
import { EmployeeRow } from './models/employee';

const MODAL_WIDTH = 'min(32rem, calc(100vw - 2rem))';

@Component({
  selector: 'dd-employees-page',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ErrorStateComponent,
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
  readonly tableConfig = TABLE_EMPLOYEES_CONFIG;
  readonly list = new ListController((filter) => this.api.list(filter), this.changes.changes$);
  searchTerm = '';

  readonly itemsPerPageOptions: DefaultOption[] = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 25, label: '25' },
  ];

  constructor(
    private readonly api: EmployeesApiService,
    private readonly changes: DataChangesService,
    private readonly modalService: ModalService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    // A URL (?search=) é a fonte da busca: permite links diretos, como os da busca global.
    this.route.queryParamMap
      .pipe(
        map((params) => params.get('search') ?? ''),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((term) => {
        this.searchTerm = term;
        this.list.update({ searchTerm: term, page: 1 });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterByTerm(term: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: term || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
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
      { width: MODAL_WIDTH, ariaLabel: row ? 'app.employees.edit' : 'app.employees.add' },
      data,
    );
  }

  confirmRemove(row: EmployeeRow): void {
    const data: ConfirmDialogData = {
      title: 'app.employees.remove-title',
      message: 'app.employees.remove-message',
      messageParams: { name: row.name },
      note: row.managedDepartments.length ? 'app.employees.remove-manager-note' : undefined,
      noteParams: { departments: row.managedDepartments.join(', ') },
      action: () => this.api.remove(row.id),
    };
    this.modalService.open(
      ConfirmDialogComponent,
      { width: MODAL_WIDTH, ariaLabel: 'app.employees.remove-title' },
      data,
    );
  }
}
