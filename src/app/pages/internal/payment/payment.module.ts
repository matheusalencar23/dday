import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';

@NgModule({
  declarations: [PaymentComponent],
  imports: [CommonModule, PaymentRoutingModule, PageTitleComponent],
})
export class PaymentModule {}
