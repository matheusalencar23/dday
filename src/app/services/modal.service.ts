import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Injectable,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalOptions } from '../models/modal-options';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalComponent?: ComponentRef<ModalComponent>;
  private contentComponent?: ComponentRef<unknown>;
  private modalInBody = false;
  options!: ModalOptions | undefined;
  vcr!: ViewContainerRef;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open(contentOrComponent: TemplateRef<Element>, options?: ModalOptions): void;

  open<C>(contentOrComponent: Type<C>, options?: ModalOptions): void;

  open<C>(
    contentOrComponent: TemplateRef<Element> | Type<C>,
    options?: ModalOptions
  ) {
    if (this.modalComponent) this.destroy();
    if (contentOrComponent instanceof TemplateRef) {
      this.openWithTemplate(
        this.vcr,
        contentOrComponent as TemplateRef<Element>
      );
    } else {
      this.openWithComponent(contentOrComponent);
    }
    this.options = options;
  }

  private openWithTemplate(
    vcr: ViewContainerRef,
    content: TemplateRef<Element>
  ) {
    this.modalInBody = false;
    vcr.clear();
    const innerContent = vcr.createEmbeddedView(content);

    this.modalComponent = vcr.createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [innerContent.rootNodes],
    });
  }

  private openWithComponent(component: Type<unknown>) {
    this.modalInBody = true;
    this.contentComponent = createComponent(component, {
      environmentInjector: this.injector,
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
  }
}
