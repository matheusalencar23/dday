import { Observable } from 'rxjs';
import { PaymentFilter } from './payment-filter';
import { Payment } from './payment';
import { Reponse } from 'src/app/models/response';

export interface PaymentService {
  getPayments(filter: PaymentFilter | null): Observable<Reponse<Payment[]>>;
}
