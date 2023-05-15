import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { InputSearchComponent } from '../input-search/input-search.component';
import { heroInformationCircle, heroBell } from '@ng-icons/heroicons/outline';
import { heroBars3Solid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'dd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, NgIconComponent, InputSearchComponent],
  providers: [
    provideIcons({ heroBars3Solid, heroInformationCircle, heroBell }),
  ],
})
export class HeaderComponent {
  @Output() openSidebar = new EventEmitter<void>();
}
