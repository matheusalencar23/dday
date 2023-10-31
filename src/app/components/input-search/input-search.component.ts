import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  Renderer2,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlassSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'dd-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
  standalone: true,
  imports: [CommonModule, NgIconComponent, FormsModule],
  providers: [
    provideIcons({ heroMagnifyingGlassSolid }),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSearchComponent),
      multi: true,
    },
  ],
})
export class InputSearchComponent implements ControlValueAccessor {
  protected _hasBorder: boolean = false;

  @Input() placeholder: string = '';
  @HostBinding('class.bordered') @Input() hasBorder = false;

  @Output() blur = new EventEmitter<void>();

  value: string = '';
  disabled: boolean = false;
  onChange: any = () => {};
  onTouch: any = () => {};

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur(): void {
    this.blur.emit();
    this.onTouch();
  }
}
