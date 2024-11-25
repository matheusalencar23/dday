import { Injectable } from '@angular/core';
import { Observable, delay, map } from 'rxjs';
import { Payment } from '../models/payment';
import { PAYMENTS } from '../mocks/payment';
import { PaymentFilter } from '../models/payment-filter';
import { Reponse } from '../models/response';
import { PaymentService } from '../models/payment-service';

@Injectable()
export class MockPaymentService implements PaymentService {
  getPayments(filter: PaymentFilter | null): Observable<Reponse<Payment[]>> {
    return new Observable<Reponse<Payment[]>>((observer) => {
      observer.next({ data: PAYMENTS, total: PAYMENTS.length });
      observer.complete();
    }).pipe(
      delay(500),
      map((response) => {
        if (filter?.searchTerm) {
          const data = response.data.filter((item) =>
            item.name
              .toLowerCase()
              .includes(filter?.searchTerm?.toLowerCase() as string)
          );
          return {
            total: data.length,
            data,
          };
        }
        return response;
      }),
      map((response) => {
        if (
          filter?.sortBy &&
          response.data?.length &&
          filter?.sortBy in response.data[0]
        ) {
          return {
            total: response.total,
            data: response.data.sort((a, b) => {
              const parameterToSort = filter.sortBy as keyof Payment;
              if (a[parameterToSort] > b[parameterToSort]) {
                return filter.desc ? -1 : 1;
              }
              if (a[parameterToSort] < b[parameterToSort]) {
                return filter.desc ? 1 : -1;
              }
              return 0;
            }),
          };
        }
        return response;
      }),
      map((response) => {
        if (filter?.page) {
          return {
            total: response.total,
            data: [...response.data].splice(
              filter.page - 1,
              filter.itensPerPage
            ),
          };
        }
        return response;
      })
    );
  }
}
