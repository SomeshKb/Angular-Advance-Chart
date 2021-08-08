import { Directive, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[chartTooltip]'
})
export class TooltipDirective {
  @Input('tooltip') tooltipTitle: string;
  tooltip: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter', ['$event']) onMouseEnter(event:any) {
    if (!this.tooltip) { this.show(event); }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) { this.hide(); }
  }

  show(event) {
    this.create();
    this.setPosition(event);
    this.renderer.addClass(this.tooltip, 'chart-tooltip-show');
  }

  hide() {
    this.renderer.removeClass(this.tooltip, 'chart-tooltip-show');
    this.renderer.removeChild(document.body, this.tooltip);
    this.tooltip = null;

  }

  create() {
    this.tooltip = this.renderer.createElement('span');

    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipTitle) // textNode
    );

    this.renderer.appendChild(document.body, this.tooltip);
    this.renderer.addClass(this.tooltip, 'chart-tooltip');
  }

  setPosition(event) {

    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let top=event.y;
    let left=event.x
    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
}
