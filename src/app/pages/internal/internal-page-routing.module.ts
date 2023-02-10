import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalPageComponent } from './internal-page.component';

const routes: Routes = [
  {
    path: '',
    component: InternalPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternalPageRoutingModule {}
