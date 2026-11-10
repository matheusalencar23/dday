import { Injectable } from '@angular/core';

/** Fração de requisições que falham quando a simulação de instabilidade está ligada. */
const UNSTABLE_ERROR_RATE = 0.3;

const LATENCY = {
  read: { min: 250, variation: 500 },
  write: { min: 400, variation: 600 },
};

/**
 * Ajustes de comportamento do backend simulado. Nada é salvo no navegador:
 * a simulação de falhas começa desligada a cada carregamento da página.
 */
@Injectable({ providedIn: 'root' })
export class FakeBackendConfig {
  private failuresEnabled = false;

  get simulateFailures(): boolean {
    return this.failuresEnabled;
  }

  setSimulateFailures(enabled: boolean): void {
    this.failuresEnabled = enabled;
  }

  latencyFor(method: string): number {
    const { min, variation } = method === 'GET' ? LATENCY.read : LATENCY.write;
    return min + Math.random() * variation;
  }

  shouldFail(): boolean {
    return this.failuresEnabled && Math.random() < UNSTABLE_ERROR_RATE;
  }
}
