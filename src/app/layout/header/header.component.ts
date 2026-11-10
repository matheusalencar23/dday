import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroInformationCircle,
  heroLanguage,
} from '@ng-icons/heroicons/outline';
import { heroBars3Solid, heroMagnifyingGlassSolid } from '@ng-icons/heroicons/solid';
import { ModalService } from 'src/app/services/modal.service';
import { SelectLanguageComponent } from 'src/app/components/select-language/select-language.component';
import { CommandPaletteComponent } from 'src/app/components/command-palette/command-palette.component';
import { AboutDialogComponent } from 'src/app/components/about-dialog/about-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'dd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, NgIconComponent, NotificationsComponent, TranslateModule],
  providers: [
    provideIcons({
      heroBars3Solid,
      heroInformationCircle,
      heroLanguage,
      heroMagnifyingGlassSolid,
    }),
  ],
})
export class HeaderComponent {
  @Output() openSidebar = new EventEmitter<void>();

  readonly isMac = /Mac|iPhone|iPad/.test(navigator.platform);

  constructor(private modalService: ModalService) {}

  @HostListener('document:keydown', ['$event'])
  onShortcut(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.openSearch();
    }
  }

  openSearch(): void {
    this.modalService.open(CommandPaletteComponent, {
      width: 'min(36rem, calc(100vw - 2rem))',
      ariaLabel: 'app.search.label',
    });
  }

  openAbout(): void {
    this.modalService.open(AboutDialogComponent, {
      width: 'min(32rem, calc(100vw - 2rem))',
      ariaLabel: 'app.about.title',
    });
  }

  openLanguageModal(): void {
    this.modalService.open(SelectLanguageComponent, { ariaLabel: 'app.language.title' });
  }
}
