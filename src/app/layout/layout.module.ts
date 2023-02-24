import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';
import {
  heroBars3Solid,
  heroHomeSolid,
  heroShoppingBagSolid,
  heroUserGroupSolid,
  heroUserSolid,
  heroXMarkSolid,
  heroMagnifyingGlassSolid,
} from '@ng-icons/heroicons/solid';
import { tablerPigMoney } from '@ng-icons/tabler-icons';
import { LogoModule } from '../components/logo/logo.module';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { InputSearchComponent } from './input-search/input-search.component';

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    InputSearchComponent,
  ],
  imports: [
    CommonModule,
    LogoModule,
    RouterModule,
    NgIconsModule.withIcons({
      heroHomeSolid,
      heroShoppingBagSolid,
      heroUserSolid,
      heroUserGroupSolid,
      heroXMarkSolid,
      tablerPigMoney,
      heroBars3Solid,
      heroMagnifyingGlassSolid,
    }),
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
