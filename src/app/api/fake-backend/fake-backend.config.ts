import { Injectable } from '@angular/core';

const STORAGE_KEY = 'dday-simulate-failures';
/** Permite fixar a taxa de falha (0 a 1), útil para testes e2e determinísticos. */
const RATE_OVERRIDE_KEY = 'dday-failure-rate';
/** Fração de requisições que falham quando a simulação de instabilidade está ligada. */
const UNSTABLE_ERROR_RATE = 0.3;

const LATENCY = {
  read: { min: 250, variation: 500 },
  write: { min: 400, variation: 600 },
};

/** Ajustes de comportamento do backend simulado. */
@Injectable({ providedIn: 'root' })
export class FakeBackendConfig {
  private failuresEnabled = readStorage(STORAGE_KEY) === 'true';
  private readonly errorRate = parseRate(readStorage(RATE_OVERRIDE_KEY)) ?? UNSTABLE_ERROR_RATE;

  get simulateFailures(): boolean {
    return this.failuresEnabled;
  }

  setSimulateFailures(enabled: boolean): void {
    this.failuresEnabled = enabled;
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {
      // Sem acesso ao storage: a preferência vale só para esta sessão.
    }
  }

  latencyFor(method: string): number {
    const { min, variation } = method === 'GET' ? LATENCY.read : LATENCY.write;
    return min + Math.random() * variation;
  }

  shouldFail(): boolean {
    return this.failuresEnabled && Math.random() < this.errorRate;
  }
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parseRate(value: string | null): number | null {
  const rate = Number(value);
  return value !== null && rate >= 0 && rate <= 1 ? rate : null;
}
