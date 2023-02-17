import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidityComponent } from './liquidity.component';

const routes: Routes = [{ path: '', component: LiquidityComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidityRoutingModule { }
