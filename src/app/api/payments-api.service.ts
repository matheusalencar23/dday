import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PaginatedResponse } from '../models/response';
import { PaymentListRow } from '../pages/internal/payment/models/payment';
import { PaymentFilter } from '../pages/internal/payment/models/payment-filter';
import { PaymentService } from '../pages/internal/payment/models/payment-service';
import { API_PREFIX } from './api.models';
import { listParams, retryTransient } from './http-helpers';

/** Datas chegam como texto ISO no JSON; a UI trabalha com `Date`. */
export function parsePaymentRow(row: PaymentListRow): PaymentListRow {
  return { ...row, date: new Date(row.date), payrollDate: new Date(row.payrollDate) };
}

/** Implementação HTTP do `PaymentService`, injetada via `PAYMENT_SERVICE_TOKEN`. */
@Injectable({ providedIn: 'root' })
export class PaymentsApiService implements PaymentService {
  constructor(private readonly http: HttpClient) {}

  getPayments(filter: PaymentFilter): Observable<PaginatedResponse<PaymentListRow>> {
    const params = listParams({ ...filter, searchTerm: filter.searchTerm ?? '' });
    return this.http
      .get<PaginatedResponse<PaymentListRow>>(`${API_PREFIX}/payments`, { params })
      .pipe(
        retryTransient(),
        map((response) => ({ ...response, data: response.data.map(parsePaymentRow) })),
      );
  }
}
