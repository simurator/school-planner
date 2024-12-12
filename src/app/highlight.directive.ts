import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appHighlight]'  // Dyrektywa będzie używana z atrybutem [appHighlight]
})
export class HighlightDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.changeBackgroundColor('orange');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.changeBackgroundColor(null);
  }

  private changeBackgroundColor(color: string | null): void {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
  }
}
