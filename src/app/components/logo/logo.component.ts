import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'dd-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LogoComponent {}
