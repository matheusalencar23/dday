import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'dd-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TableComponent implements AfterContentInit {
  @ContentChild('header') header!: ElementRef;
  @ContentChild('body') body!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterContentInit(): void {
    this.renderer.addClass(this.header.nativeElement, 'table-header');
    this.renderer.addClass(this.body.nativeElement, 'table-body');
  }
}
