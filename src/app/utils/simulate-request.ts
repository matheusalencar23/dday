import { Observable, map, timer } from 'rxjs';

const MIN_LATENCY_MS = 300;
const LATENCY_VARIATION_MS = 700;

/**
 * Simula uma requisição ao servidor: aguarda uma latência aleatória e só então
 * executa a operação. O Observable é frio, então nada acontece sem `subscribe`.
 */
export function simulateRequest<T>(operation: () => T): Observable<T> {
  const latency = MIN_LATENCY_MS + Math.random() * LATENCY_VARIATION_MS;
  return timer(latency).pipe(map(() => operation()));
}
