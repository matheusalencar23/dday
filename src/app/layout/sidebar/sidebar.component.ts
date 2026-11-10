import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarItem } from '../models/sidebar-item';
import { NAVIGATION_ITEMS } from '../navigation-items';
import { CommonModule } from '@angular/common';
import { LogoComponent } from 'src/app/components/logo/logo.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { RouterModule } from '@angular/router';
import {
  heroHomeSolid,
  heroShoppingBagSolid,
  heroUserGroupSolid,
  heroUserSolid,
  heroXMarkSolid,
} from '@ng-icons/heroicons/solid';
import { tablerPigMoney } from '@ng-icons/tabler-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dd-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LogoComponent,
    NgIconComponent,
    RouterModule,
    TranslateModule,
  ],
  providers: [
    provideIcons({
      heroXMarkSolid,
      heroHomeSolid,
      heroShoppingBagSolid,
      heroUserSolid,
      heroUserGroupSolid,
      tablerPigMoney,
    }),
  ],
  animations: [
    trigger('overlay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms', style({ opacity: 0.5 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class SidebarComponent {
  readonly sidebarItems: SidebarItem[] = NAVIGATION_ITEMS;

  @Input() isOpen: boolean = false;

  @Output() closeSidebar = new EventEmitter<void>();
}
