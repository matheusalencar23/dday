import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Payment } from '../models/payment';
import { PAYMENTS } from '../mocks/payment';
import { PaymentFilter } from '../models/payment-filter';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  getPayments(filter: PaymentFilter | null): Observable<Payment[]> {
    return new Observable<Payment[]>((observer) => {
      observer.next(PAYMENTS);
      observer.complete();
    }).pipe(
      map((data) => {
        if (filter?.searchTerm) {
          return data.filter((item) =>
            item.name
              .toLowerCase()
              .includes(filter?.searchTerm?.toLowerCase() as string)
          );
        }
        return data;
      }),
      map((data) => {
        if (filter?.sortBy && data?.length && filter?.sortBy in data[0]) {
          return data.sort((a, b) => {
            const parameterToSort = filter.sortBy as keyof Payment;
            if (a[parameterToSort] > b[parameterToSort]) {
              return filter.desc ? -1 : 1;
            }
            if (a[parameterToSort] < b[parameterToSort]) {
              return filter.desc ? 1 : -1;
            }
            return 0;
          });
        }
        return data;
      }),
      map((data) => {
        if (filter?.page) {
          return [...data].splice(filter.page - 1, filter.itensPerPage);
        }
        return data;
      })
    );
  }
}
