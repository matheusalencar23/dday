import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '../select/select.component';
import { InputSearchComponent } from '../input-search/input-search.component';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { DefaultOption } from '../select/model/options';
import { Filter } from 'src/app/models/filter';

@Component({
  selector: 'dd-default-filter',
  standalone: true,
  imports: [CommonModule, SelectComponent, InputSearchComponent, FormsModule],
  templateUrl: './default-filter.component.html',
  styleUrls: ['./default-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DefaultFilterComponent),
      multi: true,
    },
  ],
})
export class DefaultFilterComponent implements ControlValueAccessor {
  searchTerm: string = '';
  orderBy: string = 'name';
  orderByOptions: DefaultOption[] = [
    {
      label: 'Name',
      value: 'name',
    },
    {
      label: 'Amount',
      value: 'amount',
    },
    {
      label: 'Date',
      value: 'date',
    },
    {
      label: 'Status',
      value: 'status',
    },
    {
      label: 'Payroll Date',
      value: 'payrollDate',
    },
  ];

  show: number = 5;
  showOptions: DefaultOption[] = [
    {
      label: 'Show 5',
      value: 5,
    },
    {
      label: 'Show 10',
      value: 10,
    },
    {
      label: 'Show 25',
      value: 25,
    },
    {
      label: 'Show 50',
      value: 50,
    },
    {
      label: 'Show 100',
      value: 100,
    },
  ];

  disabled: boolean = false;
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: Filter): void {
    this.searchTerm = value?.searchTerm;
    this.orderBy = value?.orderBy;
    this.show = value?.show;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  changeValue(): void {
    this.onChange({
      searchTerm: this.searchTerm,
      orderBy: this.orderBy,
      show: this.show,
    });
  }
}
