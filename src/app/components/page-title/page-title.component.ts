import { Component, Input } from '@angular/core';

@Component({
  selector: 'dd-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
})
export class PageTitleComponent {
  @Input() title: string = 'Page title';
}
