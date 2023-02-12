import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgIconsModule } from '@ng-icons/core';
import {
  heroHomeSolid,
  heroShoppingBagSolid,
  heroUserGroupSolid,
  heroUserSolid,
} from '@ng-icons/heroicons/solid';
import { tablerPigMoney } from '@ng-icons/tabler-icons';
import { LogoModule } from '../components/logo/logo.module';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [LayoutComponent, SidebarComponent, HeaderComponent],
  imports: [
    CommonModule,
    LogoModule,
    NgIconsModule.withIcons({
      heroHomeSolid,
      heroShoppingBagSolid,
      heroUserSolid,
      heroUserGroupSolid,
      tablerPigMoney,
    }),
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
