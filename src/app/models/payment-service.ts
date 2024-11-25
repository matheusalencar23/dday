import { Observable } from 'rxjs';
import { PaymentFilter } from './payment-filter';
import { Reponse } from './response';
import { Payment } from './payment';

export interface PaymentService {
  getPayments(filter: PaymentFilter | null): Observable<Reponse<Payment[]>>;
}
