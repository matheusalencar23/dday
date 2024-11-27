import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { MockPaymentService } from 'src/app/pages/internal/payment/services/mock-payment.service';

@Component({
  templateUrl: './internal-page.component.html',
  styleUrls: ['./internal-page.component.scss'],
  standalone: true,
  imports: [CommonModule, LayoutComponent, RouterModule],
})
export class InternalPageComponent {}
