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
  newModalComponent!: ComponentRef<ModalComponent>;
  options!: ModalOptions | undefined;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open(
    vcrOrComponent: ViewContainerRef,
    content: TemplateRef<Element>,
    options?: ModalOptions
  ): void;

  open<C>(vcrOrComponent: Type<C>, options?: ModalOptions): void;

  open<C>(
    vcrOrComponent: ViewContainerRef | Type<C>,
    param?: TemplateRef<Element> | ModalOptions,
    options?: ModalOptions
  ) {
    if (vcrOrComponent instanceof ViewContainerRef) {
      this.openWithTemplate(vcrOrComponent, param as TemplateRef<Element>);
    } else {
      this.openWithComponent(vcrOrComponent);
    }
  }

  private openWithTemplate(
    vcr: ViewContainerRef,
    content: TemplateRef<Element>
  ) {
    vcr.clear();
    const innerContent = vcr.createEmbeddedView(content);

    this.newModalComponent = vcr.createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [innerContent.rootNodes],
    });
  }

  private openWithComponent(component: Type<unknown>) {
    const newComponent = createComponent(component, {
      environmentInjector: this.injector,
    });

    this.newModalComponent = createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [[newComponent.location.nativeElement]],
    });

    document.body.appendChild(this.newModalComponent.location.nativeElement);

    this.appRef.attachView(newComponent.hostView);
    this.appRef.attachView(this.newModalComponent.hostView);
  }

  close() {
    this.newModalComponent.instance.close();
  }
}
