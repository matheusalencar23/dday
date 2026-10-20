import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { PaginatedResponse } from '../../../../models/response';
import { StudyDataService } from '../../../../services/study-data.service';
import { PaymentService } from '../models/payment-service';
import { Payment } from '../models/payment';
import { PaymentFilter } from '../models/payment-filter';

@Injectable()
export class MockPaymentService implements PaymentService {
  constructor(private readonly studyData: StudyDataService) {}

  getPayments(filter: PaymentFilter | null): Observable<PaginatedResponse<Payment>> {
    return of(this.studyData.getPaymentSnapshot()).pipe(
      delay(Math.random() * 1000),
      map((response) => {
        const searchTerm = filter?.searchTerm?.trim().toLocaleLowerCase();
        let data = searchTerm
          ? response.filter((payment) =>
              payment.name.toLocaleLowerCase().includes(searchTerm)
            )
          : response;

        if (filter?.sortBy && data.length > 0 && filter.sortBy in data[0]) {
          const sortBy = filter.sortBy as keyof Payment;
          const direction = filter.desc ? -1 : 1;
          data = [...data].sort(
            (a, b) => comparePayments(a[sortBy], b[sortBy]) * direction
          );
        }

        const total = data.length;
        if (filter && filter.page > 0 && filter.itemsPerPage > 0) {
          const start = (filter.page - 1) * filter.itemsPerPage;
          data = data.slice(start, start + filter.itemsPerPage);
        }

        return { data, total };
      })
    );
  }
}

function comparePayments(
  first: Payment[keyof Payment],
  second: Payment[keyof Payment]
): number {
  if (first instanceof Date && second instanceof Date) {
    return first.getTime() - second.getTime();
  }

  if (typeof first === 'number' && typeof second === 'number') {
    return first - second;
  }

  return String(first).localeCompare(String(second), undefined, {
    sensitivity: 'base',
  });
}
