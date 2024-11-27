import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe(AppComponent.name, () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should render element', () => {
    expect(component).toBeTruthy();
  });
});
