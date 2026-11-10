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
import { Employee } from '../../models/employee';

export interface EmployeeFormData {
  employee?: Employee;
}

type EmployeeField = 'name' | 'email' | 'role' | 'departmentId';

@Component({
  selector: 'dd-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './employee-form.component.html',
})
export class EmployeeFormComponent {
  private readonly data = inject<EmployeeFormData | null>(MODAL_DATA, { optional: true });
  private readonly modalRef = inject<ModalRef<Employee>>(ModalRef);
  private readonly employeesApi = inject(EmployeesApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly employee = this.data?.employee;
  // Se as opções falharem, o select mantém apenas "Sem departamento".
  readonly departments$ = inject(DepartmentsApiService)
    .options()
    .pipe(catchError(() => of([])));
  saving = false;
  submitError: string | null = null;

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    email: [
      '',
      {
        validators: [Validators.required, Validators.email],
        asyncValidators: [
          uniqueValueValidator(
            (email) => this.employeesApi.isEmailAvailable(email, this.employee?.id),
            'emailTaken',
          ),
        ],
      },
    ],
    role: ['', [Validators.required, Validators.maxLength(60)]],
    departmentId: this.formBuilder.control<number | null>(null),
  });

  constructor() {
    if (this.employee) {
      const { name, email, role, departmentId } = this.employee;
      this.form.setValue({ name, email, role, departmentId });
    }
  }

  error(field: EmployeeField) {
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
      this.employeesApi
        .save(
          {
            name: value.name.trim(),
            email: value.email.trim().toLocaleLowerCase(),
            role: value.role.trim(),
            departmentId: value.departmentId,
          },
          this.employee?.id,
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
