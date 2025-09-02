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
    if (contentOrComponent instanceof TemplateRef) {
      this.openWithTemplate(
        this.vcr,
        contentOrComponent as TemplateRef<Element>
      );
    } else {
      this.openWithComponent(contentOrComponent);
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
