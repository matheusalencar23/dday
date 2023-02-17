import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidityRoutingModule } from './liquidity-routing.module';
import { LiquidityComponent } from './liquidity.component';


@NgModule({
  declarations: [
    LiquidityComponent
  ],
  imports: [
    CommonModule,
    LiquidityRoutingModule
  ]
})
export class LiquidityModule { }
