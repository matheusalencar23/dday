import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  API_PREFIX,
  DashboardData,
  LiquidityData,
  NotificationDto,
  SearchResponse,
} from './api.models';
import { retryTransient } from './http-helpers';
import { parsePaymentRow } from './payments-api.service';

/** Endpoints de leitura agregada: dashboard, liquidez, notificações e busca. */
@Injectable({ providedIn: 'root' })
export class ReportsApiService {
  constructor(private readonly http: HttpClient) {}

  dashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${API_PREFIX}/dashboard`).pipe(retryTransient());
  }

  liquidity(): Observable<LiquidityData> {
    return this.http.get<LiquidityData>(`${API_PREFIX}/liquidity`).pipe(
      retryTransient(),
      map((data) => ({ ...data, pendingPayments: data.pendingPayments.map(parsePaymentRow) })),
    );
  }

  notifications(): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(`${API_PREFIX}/notifications`).pipe(retryTransient());
  }

  search(term: string): Observable<SearchResponse> {
    const params = new HttpParams().set('q', term);
    return this.http.get<SearchResponse>(`${API_PREFIX}/search`, { params });
  }
}
