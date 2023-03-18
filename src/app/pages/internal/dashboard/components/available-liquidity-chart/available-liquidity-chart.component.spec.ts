import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableLiquidityChartComponent } from './available-liquidity-chart.component';

describe('AvailableLiquidityChartComponent', () => {
  let component: AvailableLiquidityChartComponent;
  let fixture: ComponentFixture<AvailableLiquidityChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableLiquidityChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableLiquidityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
