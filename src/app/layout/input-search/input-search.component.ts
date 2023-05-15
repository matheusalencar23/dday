import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class InputSearchComponent {}
