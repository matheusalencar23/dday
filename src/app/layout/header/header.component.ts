import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'dd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, NgIconComponent, InputSearchComponent],
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
      animations: {
        modal: {
          enter: 'enter-scaling 0.3s ease-out',
          leave: 'fade-out 0.3s forwards',
        },
        overlay: {
          enter: 'fade-in 1s',
          leave: 'fade-out 0.3s forwards',
        },
      },
      size: {
        width: '40rem',
      },
    });
  }
}
