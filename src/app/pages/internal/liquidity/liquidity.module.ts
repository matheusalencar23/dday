import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidityRoutingModule } from './liquidity-routing.module';
import { LiquidityComponent } from './liquidity.component';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';

@NgModule({
  declarations: [LiquidityComponent],
  imports: [CommonModule, LiquidityRoutingModule, PageTitleComponent],
})
export class LiquidityModule {}
