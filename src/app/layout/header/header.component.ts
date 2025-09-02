import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, TemplateRef } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { InputSearchComponent } from '../../components/input-search/input-search.component';
import {
  heroInformationCircle,
  heroBell,
  heroLanguage,
} from '@ng-icons/heroicons/outline';
import { heroBars3Solid } from '@ng-icons/heroicons/solid';
import { ModalService } from 'src/app/services/modal.service';
import { SelectLanguageComponent } from 'src/app/components/select-language/select-language.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgIconComponent,
    InputSearchComponent,
    TranslateModule,
  ],
  providers: [
    provideIcons({
      heroBars3Solid,
      heroInformationCircle,
      heroBell,
      heroLanguage,
    }),
  ],
})
export class HeaderComponent {
  @Output() openSidebar = new EventEmitter<void>();

  constructor(private modalService: ModalService) {}

  openLanguageModal(): void {
    this.modalService.open(SelectLanguageComponent, {
      width: '40rem',
    });
  }

  open(view: TemplateRef<Element>) {
    this.modalService.open(view);
  }
}
