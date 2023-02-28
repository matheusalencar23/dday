import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { PageTitleModule } from 'src/app/components/page-title/page-title.module';

@NgModule({
  declarations: [PaymentComponent],
  imports: [CommonModule, PaymentRoutingModule, PageTitleModule],
})
export class PaymentModule {}
