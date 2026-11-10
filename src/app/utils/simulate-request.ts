import { Observable, map, timer } from 'rxjs';

export interface SimulatedLatency {
  min: number;
  variation: number;
}

const DEFAULT_LATENCY: SimulatedLatency = { min: 300, variation: 700 };

/**
 * Simula uma requisição ao servidor: aguarda uma latência aleatória e só então
 * executa a operação. O Observable é frio, então nada acontece sem `subscribe`.
 */
export function simulateRequest<T>(
  operation: () => T,
  latency: SimulatedLatency = DEFAULT_LATENCY
): Observable<T> {
  const delay = latency.min + Math.random() * latency.variation;
  return timer(delay).pipe(map(() => operation()));
}
