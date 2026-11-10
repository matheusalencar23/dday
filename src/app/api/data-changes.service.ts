import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type ChangedResource = 'employees' | 'departments' | 'payments';

/**
 * Avisa a aplicação quando uma escrita na API foi concluída, para que telas e
 * painéis que exibem dados relacionados recarreguem (invalidação de cache).
 */
@Injectable({ providedIn: 'root' })
export class DataChangesService {
  private readonly changesSubject = new Subject<ChangedResource>();
  readonly changes$: Observable<ChangedResource> = this.changesSubject.asObservable();

  notify(resource: ChangedResource): void {
    this.changesSubject.next(resource);
  }
}
