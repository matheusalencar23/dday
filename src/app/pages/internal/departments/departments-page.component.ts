import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlus } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, distinctUntilChanged, filter, map, takeUntil } from 'rxjs';
import { DataChangesService } from 'src/app/api/data-changes.service';
import { DepartmentsApiService } from 'src/app/api/departments-api.service';
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
import { ToastService } from 'src/app/services/toast.service';
import { requestErrorKey } from 'src/app/utils/request-error-key';
import { ListController } from 'src/app/utils/list-controller';
import {
  DepartmentFormComponent,
  DepartmentFormData,
} from './components/department-form/department-form.component';
import { TABLE_DEPARTMENTS_CONFIG } from './data-table-departments-config';
import { Department, DepartmentRow } from './models/department';

const MODAL_WIDTH = 'min(32rem, calc(100vw - 2rem))';

@Component({
  templateUrl: './departments-page.component.html',
  styleUrls: ['./departments-page.component.scss'],
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
export class DepartmentsPageComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly tableConfig = TABLE_DEPARTMENTS_CONFIG;
  readonly list = new ListController((filter) => this.api.list(filter), this.changes.changes$);
  searchTerm = '';

  readonly itemsPerPageOptions: DefaultOption[] = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 25, label: '25' },
  ];

  constructor(
    private readonly api: DepartmentsApiService,
    private readonly changes: DataChangesService,
    private readonly modalService: ModalService,
    private readonly toasts: ToastService,
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

  openForm(row?: DepartmentRow): void {
    const data: DepartmentFormData = {
      department: row && {
        id: row.id,
        name: row.name,
        description: row.description,
        managerId: row.managerId,
      },
    };
    this.modalService
      .open<DepartmentFormComponent, Department>(
        DepartmentFormComponent,
        { width: MODAL_WIDTH, ariaLabel: row ? 'app.departments.edit' : 'app.departments.add' },
        data,
      )
      .afterClosed$.pipe(filter((saved): saved is Department => !!saved))
      .subscribe((saved) =>
        this.toasts.success(row ? 'app.departments.updated' : 'app.departments.created', {
          name: saved.name,
        }),
      );
  }

  confirmRemove(row: DepartmentRow): void {
    const data: ConfirmDialogData = {
      title: 'app.departments.remove-title',
      message: 'app.departments.remove-message',
      messageParams: { name: row.name },
      note: row.employeeCount ? 'app.departments.delete-note' : undefined,
      action: () => this.api.remove(row.id),
    };
    this.modalService
      .open<ConfirmDialogComponent, boolean>(
        ConfirmDialogComponent,
        { width: MODAL_WIDTH, ariaLabel: 'app.departments.remove-title' },
        data,
      )
      .afterClosed$.pipe(filter(Boolean))
      .subscribe(() =>
        this.toasts.success(
          'app.departments.removed',
          { name: row.name },
          { labelKey: 'app.common.undo', run: () => this.undoRemove(row) },
        ),
      );
  }

  /** Desfaz a remoção pelo endpoint de restauração do servidor. */
  private undoRemove(row: DepartmentRow): void {
    this.api.restore(row.id).subscribe({
      next: () => this.toasts.success('app.common.restored', { name: row.name }),
      error: (error: unknown) =>
        this.toasts.error(
          requestErrorKey(error, {
            404: 'app.common.restore-expired',
            409: 'app.departments.restore-conflict',
          }),
          { name: row.name },
        ),
    });
  }
}
