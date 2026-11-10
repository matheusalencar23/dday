import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastAction {
  /** Chave de tradução do rótulo do botão. */
  labelKey: string;
  run: () => void;
}

export interface Toast {
  id: number;
  type: ToastType;
  /** Chave de tradução da mensagem e seus parâmetros. */
  messageKey: string;
  params?: Record<string, unknown>;
  action?: ToastAction;
}

export type ToastInput = Omit<Toast, 'id'>;

interface Timer {
  handle?: ReturnType<typeof setTimeout>;
  remaining: number;
  startedAt: number;
}

const MAX_TOASTS = 3;
const DURATION_MS = { default: 5000, withAction: 8000, error: 8000 };

/**
 * Mensagens temporárias de feedback. O tempo de exibição pode ser pausado
 * (mouse ou foco sobre o toast), para que ações como "Desfazer" continuem
 * alcançáveis por quem usa teclado ou leva mais tempo para ler.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<Toast[]>([]);
  private readonly timers = new Map<number, Timer>();
  private nextId = 1;

  readonly toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  show(input: ToastInput, duration = defaultDuration(input)): number {
    const id = this.nextId++;
    const toasts = [...this.toastsSubject.value, { ...input, id }];

    // Mantém apenas os mais recentes; os mais antigos saem da tela.
    toasts.slice(0, -MAX_TOASTS).forEach((toast) => this.clearTimer(toast.id));
    this.toastsSubject.next(toasts.slice(-MAX_TOASTS));

    this.timers.set(id, { remaining: duration, startedAt: 0 });
    this.resume(id);
    return id;
  }

  success(messageKey: string, params?: Record<string, unknown>, action?: ToastAction): number {
    return this.show({ type: 'success', messageKey, params, action });
  }

  error(messageKey: string, params?: Record<string, unknown>): number {
    return this.show({ type: 'error', messageKey, params });
  }

  dismiss(id: number): void {
    this.clearTimer(id);
    this.toastsSubject.next(this.toastsSubject.value.filter((toast) => toast.id !== id));
  }

  /** Executa a ação do toast e o fecha. */
  runAction(toast: Toast): void {
    this.dismiss(toast.id);
    toast.action?.run();
  }

  pause(id: number): void {
    const timer = this.timers.get(id);
    if (!timer?.handle) return;
    clearTimeout(timer.handle);
    timer.handle = undefined;
    timer.remaining -= Date.now() - timer.startedAt;
  }

  resume(id: number): void {
    const timer = this.timers.get(id);
    if (!timer || timer.handle) return;
    timer.startedAt = Date.now();
    timer.handle = setTimeout(() => this.dismiss(id), Math.max(0, timer.remaining));
  }

  private clearTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer?.handle) clearTimeout(timer.handle);
    this.timers.delete(id);
  }
}

function defaultDuration(toast: ToastInput): number {
  if (toast.type === 'error') return DURATION_MS.error;
  return toast.action ? DURATION_MS.withAction : DURATION_MS.default;
}
