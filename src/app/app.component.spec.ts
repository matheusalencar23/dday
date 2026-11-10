import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { ModalService } from './services/modal.service';

describe(AppComponent.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    });
  });

  it('cria o componente e registra o container de modais', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(TestBed.inject(ModalService).vcr).toBeDefined();
  });
});
