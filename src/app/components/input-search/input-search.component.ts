import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  @Input() placeholder = '';
  @Input() ariaLabel = '';
  @HostBinding('class.bordered') @Input() hasBorder = false;

  value = '';
  disabled = false;
  private onChange: (value: string) => void = () => {
    // Substituída pelo Angular em registerOnChange.
  };
  private onTouch: () => void = () => {
    // Substituída pelo Angular em registerOnTouched.
  };

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  valueChanged(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur(): void {
    this.onTouch();
  }
}
