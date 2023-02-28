import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPerDayChartComponent } from './request-per-day-chart.component';

describe('RequestPerDayChartComponent', () => {
  let component: RequestPerDayChartComponent;
  let fixture: ComponentFixture<RequestPerDayChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPerDayChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPerDayChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
