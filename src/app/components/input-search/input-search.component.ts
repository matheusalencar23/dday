import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlassSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'dd-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroMagnifyingGlassSolid })],
})
export class InputSearchComponent {
  protected _hasBorder: boolean = false;

  @Input() placeholder: string = '';
  @Input() set hasBorder(value: boolean) {
    this._hasBorder = value;
    if (value) this.renderer.addClass(this.elRef.nativeElement, 'bordered');
  }

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
}
