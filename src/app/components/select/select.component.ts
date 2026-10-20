import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { DefaultOption } from './models/options';

@Component({
  selector: 'dd-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() items: DefaultOption[] = [];
  @Input() ariaLabel = '';

  value: string | number | null = null;
  disabled: boolean = false;
  private onChange: (value: string | number | null) => void = () => {};
  private onTouch: () => void = () => {};

  @Output() blur = new EventEmitter<void>();

  writeValue(value: string | number | null): void {
    this.value = value;
  }

  valueChanged(value: string | number | null): void {
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
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
