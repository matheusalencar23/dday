import {
  AfterContentInit,
  Directive,
  ElementRef,
  OnInit,
  Renderer2,
  TemplateRef,
} from '@angular/core';

interface Colors {
  color: string;
  bgColor: string;
}

@Directive({
  selector: '[idChip]',
  standalone: true,
})
export class IdChipDirective implements AfterContentInit {
  colors: Colors[] = [
    {
      color: '#217efd',
      bgColor: '#bdd9fe',
    },
    {
      color: '#ffb536',
      bgColor: '#ffb5364a',
    },
    {
      color: '#db5aee',
      bgColor: '#f4cefa',
    },
    {
      color: '#f3654a',
      bgColor: '#fbd1c9',
    },
    {
      color: '#384455',
      bgColor: '#c5d1df',
    },
    {
      color: '#895bf1',
      bgColor: '#dccefb',
    },
    {
      color: '#27ae60',
      bgColor: '#27ae604a',
    },
    {
      color: '#56ccf2',
      bgColor: '#56ccf24a',
    },
  ];
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterContentInit(): void {
    const random = Math.floor(Math.random() * this.colors.length);
    const color = this.colors[random];
    const el = this.elRef.nativeElement;
    const value = this.elRef.nativeElement.innerText;

    const span = this.renderer.createElement('span');
    this.renderer.createText(value);
    this.renderer.appendChild(span, this.renderer.createText(value));

    this.renderer.setStyle(span, 'color', color.color);
    this.renderer.setStyle(span, 'background-color', color.bgColor);
    this.renderer.setStyle(span, 'display', 'block');
    this.renderer.setStyle(span, 'text-align', 'center');
    this.renderer.setStyle(span, 'padding', '14px');
    this.renderer.setStyle(span, 'border-radius', '10px');

    this.renderer.setProperty(el, 'innerText', '');
    this.renderer.appendChild(el, span);
  }
}
