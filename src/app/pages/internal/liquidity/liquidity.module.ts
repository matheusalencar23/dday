import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidityRoutingModule } from './liquidity-routing.module';
import { LiquidityComponent } from './liquidity.component';
import { PageTitleModule } from 'src/app/components/page-title/page-title.module';

@NgModule({
  declarations: [LiquidityComponent],
  imports: [CommonModule, LiquidityRoutingModule, PageTitleModule],
})
export class LiquidityModule {}
