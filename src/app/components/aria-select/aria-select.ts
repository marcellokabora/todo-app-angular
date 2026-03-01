import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-aria-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative" (keydown)="onKeydown($event)">
      <!-- Trigger button -->
      <button
        #triggerBtn
        type="button"
        role="combobox"
        [attr.aria-label]="label()"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="listbox"
        [attr.aria-controls]="listboxId"
        [attr.aria-activedescendant]="activeDescendant()"
        (click)="toggle()"
        class="flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
        [class]="isOpen()
          ? 'border-indigo-500 ring-1 ring-indigo-500'
          : 'border-gray-300 hover:border-gray-400'"
      >
        <span [class]="selectedLabel() ? 'text-gray-900' : 'text-gray-400'">
          {{ selectedLabel() || placeholder() }}
        </span>
        <svg
          class="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-150"
          [style.transform]="isOpen() ? 'rotate(180deg)' : 'rotate(0deg)'"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Listbox dropdown -->
      @if (isOpen()) {
        <ul
          #listboxEl
          [id]="listboxId"
          role="listbox"
          [attr.aria-label]="label()"
          tabindex="-1"
          class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg focus:outline-none"
        >
          @for (opt of options(); track opt.value; let i = $index) {
            <li
              [id]="optionId(i)"
              role="option"
              [attr.aria-selected]="opt.value === value()"
              (click)="select(opt.value)"
              (mouseenter)="activeIndex.set(i)"
              class="flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-sm transition-colors"
              [class]="optionClass(opt.value, i)"
            >
              @if (opt.value === value()) {
                <svg
                  class="h-4 w-4 shrink-0 text-indigo-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clip-rule="evenodd"
                  />
                </svg>
              } @else {
                <span class="h-4 w-4 shrink-0" aria-hidden="true"></span>
              }
              {{ opt.label }}
            </li>
          }
        </ul>
      }
    </div>
  `,
  host: {
    '(document:pointerdown)': 'onDocumentPointerDown($event)',
  },
  styles: `:host { display: block; }`,
})
export class AriaSelectComponent {
  readonly value = model<string>('');
  readonly options = input<{ value: string; label: string }[]>([]);
  readonly label = input('Select an option');
  readonly placeholder = input('Select...');

  protected readonly listboxId = `listbox-${Math.random().toString(36).slice(2)}`;
  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(-1);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly triggerBtn = viewChild<ElementRef<HTMLButtonElement>>('triggerBtn');

  protected readonly selectedLabel = computed(
    () => this.options().find((o) => o.value === this.value())?.label ?? '',
  );

  protected readonly activeDescendant = computed(() => {
    const i = this.activeIndex();
    return i >= 0 ? this.optionId(i) : null;
  });

  protected optionId(index: number): string {
    return `${this.listboxId}-opt-${index}`;
  }

  protected optionClass(val: string, index: number): string {
    const active = index === this.activeIndex();
    const selected = val === this.value();
    if (active) return 'bg-indigo-50 text-indigo-700';
    if (selected) return 'font-medium text-indigo-600';
    return 'text-gray-700 hover:bg-gray-50';
  }

  protected toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  protected open(): void {
    const idx = this.options().findIndex((o) => o.value === this.value());
    this.activeIndex.set(idx >= 0 ? idx : 0);
    this.isOpen.set(true);
  }

  protected close(): void {
    this.isOpen.set(false);
    this.activeIndex.set(-1);
  }

  protected select(val: string): void {
    this.value.set(val);
    this.close();
    this.triggerBtn()?.nativeElement.focus();
  }

  protected onKeydown(event: KeyboardEvent): void {
    const opts = this.options();
    const len = opts.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.open();
        } else {
          this.activeIndex.update((i) => (i + 1) % len);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.open();
        } else {
          this.activeIndex.update((i) => (i - 1 + len) % len);
        }
        break;

      case 'Home':
        if (this.isOpen()) {
          event.preventDefault();
          this.activeIndex.set(0);
        }
        break;

      case 'End':
        if (this.isOpen()) {
          event.preventDefault();
          this.activeIndex.set(len - 1);
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.isOpen()) {
          const i = this.activeIndex();
          if (i >= 0 && i < len) this.select(opts[i].value);
        } else {
          this.open();
        }
        break;

      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close();
          this.triggerBtn()?.nativeElement.focus();
        }
        break;

      case 'Tab':
        if (this.isOpen()) this.close();
        break;
    }
  }

  protected onDocumentPointerDown(event: PointerEvent): void {
    if (this.isOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }
}
