import { ChangeDetectionStrategy, Component, contentChild, ElementRef, input } from '@angular/core';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
      [class]="containerClass()"
    >
      @if (hasHeader) {
        <div class="border-b border-border-light px-5 py-4">
          <ng-content select="[card-header]" />
        </div>
      }
      <div class="px-5 py-4">
        <ng-content select="[card-body]" />
      </div>
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class CardComponent {
  readonly containerClass = input('');
  readonly headerRef = contentChild<ElementRef>('cardHeader');

  protected get hasHeader(): boolean {
    return !!this.headerRef();
  }
}
