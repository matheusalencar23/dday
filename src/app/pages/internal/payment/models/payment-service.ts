import { Observable } from 'rxjs';
import { PaymentFilter } from './payment-filter';
import { Payment } from './payment';
import { Reponse } from 'src/app/models/response';
import { InjectionToken } from '@angular/core';

export const PAYMENT_SERVICE_TOKEN = new InjectionToken<PaymentService>(
  'PAYMENT_SERVICE'
);

export interface PaymentService {
  getPayments(filter: PaymentFilter | null): Observable<Reponse<Payment[]>>;
}
