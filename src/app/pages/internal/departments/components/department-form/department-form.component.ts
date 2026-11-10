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
  private readonly studyData = inject(StudyDataService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly department = this.data?.department;
  readonly employees$ = this.studyData.employees$.pipe(
    map((employees) => [...employees].sort((a, b) => a.name.localeCompare(b.name)))
  );
  saving = false;

  readonly form = this.formBuilder.group({
    name: [
      '',
      {
        validators: [Validators.required, Validators.maxLength(60)],
        asyncValidators: [
          uniqueValueValidator(
            (name) => this.studyData.isDepartmentNameTaken(name, this.department?.id),
            'departmentTaken'
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

    whenValidated(this.form).subscribe((valid) => {
      if (!valid) return;
      this.saving = true;
      const value = this.form.getRawValue();
      this.studyData
        .saveDepartment({
          ...value,
          id: this.department?.id,
          name: value.name.trim(),
          description: value.description.trim(),
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
