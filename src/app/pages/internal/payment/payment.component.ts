import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputSearchComponent } from 'src/app/components/input-search/input-search.component';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    InputSearchComponent,
    FormsModule,
  ],
})
export class PaymentComponent {
  searchTerm: string = '';
}
