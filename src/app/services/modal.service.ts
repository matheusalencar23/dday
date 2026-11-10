import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Injectable,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalOptions } from '../models/modal-options';
import { MODAL_DATA, ModalRef } from '../models/modal-ref';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalComponent?: ComponentRef<ModalComponent>;
  private contentComponent?: ComponentRef<unknown>;
  private modalInBody = false;
  /** O serviço só precisa avisar o modal ativo de que ele saiu da tela. */
  private activeRef?: Pick<ModalRef, 'notifyClosed'>;
  private previousFocus: HTMLElement | null = null;
  options!: ModalOptions | undefined;
  vcr!: ViewContainerRef;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open<R = unknown>(content: TemplateRef<unknown>, options?: ModalOptions): ModalRef<R>;

  open<C, R = unknown>(
    component: Type<C>,
    options?: ModalOptions,
    data?: unknown
  ): ModalRef<R>;

  open<C, R = unknown>(
    contentOrComponent: TemplateRef<unknown> | Type<C>,
    options?: ModalOptions,
    data?: unknown
  ): ModalRef<R> {
    if (this.modalComponent) this.destroy();

    this.options = options;
    this.previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const modalRef = new ModalRef<R>(() => this.close());
    this.activeRef = modalRef;

    if (contentOrComponent instanceof TemplateRef) {
      this.openWithTemplate(this.vcr, contentOrComponent);
    } else {
      this.openWithComponent(contentOrComponent, modalRef, data);
    }
    return modalRef;
  }

  private openWithTemplate(vcr: ViewContainerRef, content: TemplateRef<unknown>) {
    this.modalInBody = false;
    vcr.clear();
    const innerContent = vcr.createEmbeddedView(content);

    this.modalComponent = vcr.createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [innerContent.rootNodes],
    });
  }

  private openWithComponent<R>(
    component: Type<unknown>,
    modalRef: ModalRef<R>,
    data: unknown
  ) {
    this.modalInBody = true;
    const elementInjector = Injector.create({
      providers: [
        { provide: MODAL_DATA, useValue: data },
        { provide: ModalRef, useValue: modalRef },
      ],
    });
    this.contentComponent = createComponent(component, {
      environmentInjector: this.injector,
      elementInjector,
    });

    this.modalComponent = createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [[this.contentComponent.location.nativeElement]],
    });

    document.body.appendChild(this.modalComponent.location.nativeElement);

    this.appRef.attachView(this.contentComponent.hostView);
    this.appRef.attachView(this.modalComponent.hostView);
  }

  close() {
    this.modalComponent?.instance.close();
  }

  destroy(): void {
    if (this.modalInBody) {
      if (this.contentComponent) {
        this.appRef.detachView(this.contentComponent.hostView);
        this.contentComponent.destroy();
        this.contentComponent = undefined;
      }
      if (this.modalComponent) {
        this.appRef.detachView(this.modalComponent.hostView);
        this.modalComponent.destroy();
        this.modalComponent = undefined;
      }
    } else if (this.vcr) {
      this.vcr.clear();
      this.modalComponent = undefined;
    }

    const modalRef = this.activeRef;
    this.activeRef = undefined;
    modalRef?.notifyClosed();

    if (this.previousFocus?.isConnected) this.previousFocus.focus();
    this.previousFocus = null;
  }
}
