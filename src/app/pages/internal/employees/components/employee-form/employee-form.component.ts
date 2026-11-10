import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { MODAL_DATA, ModalRef } from 'src/app/models/modal-ref';
import { StudyDataService } from 'src/app/services/study-data.service';
import { controlError, uniqueValueValidator } from 'src/app/utils/form-validators';
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
  private readonly studyData = inject(StudyDataService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly employee = this.data?.employee;
  readonly departments$ = this.studyData.departments$.pipe(
    map((departments) => [...departments].sort((a, b) => a.name.localeCompare(b.name)))
  );
  saving = false;

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    email: [
      '',
      {
        validators: [Validators.required, Validators.email],
        asyncValidators: [
          uniqueValueValidator(
            (email) => this.studyData.isEmailTaken(email, this.employee?.id),
            'emailTaken'
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

    whenValidated(this.form).subscribe((valid) => {
      if (!valid) return;
      this.saving = true;
      const value = this.form.getRawValue();
      this.studyData
        .saveEmployee({
          ...value,
          id: this.employee?.id,
          name: value.name.trim(),
          email: value.email.trim().toLocaleLowerCase(),
          role: value.role.trim(),
        })
        .subscribe({
          next: (saved) => this.modalRef.close(saved),
          error: () => (this.saving = false),
        });
    });
  }

  cancel(): void {
    this.modalRef.close();
  }
}
