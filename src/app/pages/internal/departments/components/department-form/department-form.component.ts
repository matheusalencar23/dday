import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';
import { DepartmentsApiService } from 'src/app/api/departments-api.service';
import { EmployeesApiService } from 'src/app/api/employees-api.service';
import { MODAL_DATA, ModalRef } from 'src/app/models/modal-ref';
import {
  applyServerError,
  controlError,
  uniqueValueValidator,
} from 'src/app/utils/form-validators';
import { whenValidated } from 'src/app/utils/when-validated';
import { Department } from '../../models/department';

export interface DepartmentFormData {
  department?: Department;
}

type DepartmentField = 'name' | 'description' | 'managerId';

@Component({
  selector: 'dd-department-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './department-form.component.html',
})
export class DepartmentFormComponent {
  private readonly data = inject<DepartmentFormData | null>(MODAL_DATA, { optional: true });
  private readonly modalRef = inject<ModalRef<Department>>(ModalRef);
  private readonly departmentsApi = inject(DepartmentsApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly department = this.data?.department;
  // Se as opções falharem, o select mantém apenas "Sem responsável".
  readonly employees$ = inject(EmployeesApiService)
    .options()
    .pipe(catchError(() => of([])));
  saving = false;
  submitError: string | null = null;

  readonly form = this.formBuilder.group({
    name: [
      '',
      {
        validators: [Validators.required, Validators.maxLength(60)],
        asyncValidators: [
          uniqueValueValidator(
            (name) => this.departmentsApi.isNameAvailable(name, this.department?.id),
            'departmentTaken',
          ),
        ],
      },
    ],
    description: ['', [Validators.required, Validators.maxLength(160)]],
    managerId: this.formBuilder.control<number | null>(null),
  });

  constructor() {
    if (this.department) {
      const { name, description, managerId } = this.department;
      this.form.setValue({ name, description, managerId });
    }
  }

  error(field: DepartmentField) {
    return controlError(this.form.controls[field]);
  }

  submit(): void {
    if (this.saving) return;
    this.form.markAllAsTouched();
    this.submitError = null;

    whenValidated(this.form).subscribe((valid) => {
      if (!valid) return;
      this.saving = true;
      const value = this.form.getRawValue();
      this.departmentsApi
        .save(
          {
            name: value.name.trim(),
            description: value.description.trim(),
            managerId: value.managerId,
          },
          this.department?.id,
        )
        .subscribe({
          next: (saved) => this.modalRef.close(saved),
          error: (error: unknown) => {
            this.saving = false;
            this.submitError = applyServerError(this.form, error);
          },
        });
    });
  }

  cancel(): void {
    this.modalRef.close();
  }
}
