import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';
import { PAYMENTS } from '../mocks/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  getPayments(): Observable<Payment[]> {
    return new Observable<Payment[]>((observer) => {
      observer.next(PAYMENTS);
      observer.complete();
    });
  }
}
