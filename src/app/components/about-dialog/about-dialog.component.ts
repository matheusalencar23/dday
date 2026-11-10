import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ModalRef } from 'src/app/models/modal-ref';

@Component({
  selector: 'dd-about-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss'],
})
export class AboutDialogComponent {
  private readonly modalRef = inject(ModalRef);

  readonly repositoryUrl = 'https://github.com/matheusalencar23/dday';
  readonly highlights = [
    'app.about.highlights.standalone',
    'app.about.highlights.rxjs',
    'app.about.highlights.forms',
    'app.about.highlights.i18n',
    'app.about.highlights.a11y',
    'app.about.highlights.tests',
  ];

  close(): void {
    this.modalRef.close();
  }
}
