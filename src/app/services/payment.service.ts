import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Payment } from '../models/payment';
import { PAYMENTS } from '../mocks/payment';

export interface PaymentFilter {
  sortBy: keyof Payment;
  desc: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  getPayments(filter?: PaymentFilter): Observable<Payment[]> {
    return new Observable<Payment[]>((observer) => {
      observer.next(PAYMENTS);
      observer.complete();
    }).pipe(
      map((data) => {
        if (filter?.sortBy) {
          return data.sort((a, b) => {
            if (a[filter.sortBy] > b[filter.sortBy]) {
              return filter.desc ? -1 : 1;
            }
            if (a[filter.sortBy] < b[filter.sortBy]) {
              return filter.desc ? 1 : -1;
            }
            return 0;
          });
        }
        return data;
      })
    );
  }
}
