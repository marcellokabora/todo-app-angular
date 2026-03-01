import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-aria-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative" (keydown)="onKeydown($event)">
      <!-- Search icon -->
      <svg
        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
          clip-rule="evenodd"
        />
      </svg>

      <!-- Combobox input -->
      <input
        #inputEl
        type="text"
        role="combobox"
        [attr.aria-label]="label()"
        [attr.aria-expanded]="isOpen()"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        [attr.aria-controls]="listboxId"
        [attr.aria-activedescendant]="activeDescendant()"
        [placeholder]="placeholder()"
        [value]="query()"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="touched.set(true)"
        autocomplete="off"
        spellcheck="false"
        class="w-full rounded-lg border bg-surface py-2 pl-9 pr-8 text-sm text-heading transition-colors focus:outline-none focus:ring-1 focus:ring-accent-ring"
        [class]="isOpen()
          ? 'border-accent-ring ring-1 ring-accent-ring'
          : 'border-input-border'"
      />

      <!-- Clear button -->
      @if (query()) {
        <button
          type="button"
          aria-label="Clear"
          tabindex="-1"
          (click)="clear()"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-placeholder hover:text-body focus:outline-none focus:ring-1 focus:ring-accent-ring"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      }

      <!-- Listbox dropdown -->
      @if (isOpen()) {
        <ul
          [id]="listboxId"
          role="listbox"
          [attr.aria-label]="label()"
          tabindex="-1"
          class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-surface py-1 shadow-lg focus:outline-none"
        >
          @if (filtered().length === 0) {
            <li role="presentation" class="px-3 py-2 text-sm text-placeholder italic">
              No results found
            </li>
          } @else {
            @for (opt of filtered(); track opt.value; let i = $index) {
              <li
                [id]="optionId(i)"
                role="option"
                [attr.aria-selected]="opt.value === value()"
                (click)="select(opt)"
                (mouseenter)="activeIndex.set(i)"
                class="flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-sm transition-colors"
                [class]="optionClass(opt.value, i)"
              >
                <!-- Highlight matched portion -->
                @if (matchStart(opt.label) > -1 && query()) {
                  <span aria-hidden="true">
                    {{ opt.label.slice(0, matchStart(opt.label)) }}<mark
                      class="bg-accent-lighter text-accent-text-dark rounded-sm"
                      >{{ opt.label.slice(matchStart(opt.label), matchStart(opt.label) + query().length) }}</mark
                    >{{ opt.label.slice(matchStart(opt.label) + query().length) }}
                  </span>
                  <!-- Screen-reader full label -->
                  <span class="sr-only">{{ opt.label }}</span>
                } @else {
                  {{ opt.label }}
                }

                @if (opt.value === value()) {
                  <svg
                    class="ml-auto h-4 w-4 shrink-0 text-accent-text"
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
                }
              </li>
            }
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
export class AriaAutocompleteComponent {
  readonly value = model<string>('');
  readonly touched = model(false);
  readonly options = input<{ value: string; label: string }[]>([]);
  readonly label = input('Search');
  readonly placeholder = input('Type to search...');

  protected readonly listboxId = `autocomplete-${Math.random().toString(36).slice(2)}`;
  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(0);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  // Sync display text with the model value
  protected readonly query = linkedSignal({
    source: this.value,
    computation: (val: string) => {
      const opt = this.options().find((o) => o.value === val);
      return opt?.label ?? val;
    },
  });

  // Case-insensitive substring filter
  protected readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.options();
    return this.options().filter((o) => o.label.toLowerCase().includes(q));
  });

  protected readonly activeDescendant = computed(() => {
    const i = this.activeIndex();
    return this.isOpen() && i >= 0 ? this.optionId(i) : null;
  });

  protected optionId(index: number): string {
    return `${this.listboxId}-opt-${index}`;
  }

  /** Returns the start index of the query match within the label, or -1. */
  protected matchStart(label: string): number {
    return label.toLowerCase().indexOf(this.query().toLowerCase());
  }

  protected optionClass(val: string, index: number): string {
    const active = index === this.activeIndex();
    const selected = val === this.value();
    if (active) return 'bg-accent-light text-accent-text-dark';
    if (selected) return 'font-medium text-accent-text';
    return 'text-body hover:bg-surface-hover';
  }

  protected onFocus(): void {
    this.open();
  }

  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.query.set(text);
    this.activeIndex.set(0);
    this.isOpen.set(true);
    if (!text) this.value.set('');
  }

  protected select(opt: { value: string; label: string }): void {
    this.value.set(opt.value);
    this.query.set(opt.label);
    this.isOpen.set(false);
    this.inputEl()?.nativeElement.focus();
  }

  protected clear(): void {
    this.value.set('');
    this.query.set('');
    this.isOpen.set(false);
    this.inputEl()?.nativeElement.focus();
  }

  protected open(): void {
    this.activeIndex.set(0);
    this.isOpen.set(true);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const opts = this.filtered();
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
        if (this.isOpen()) {
          event.preventDefault();
          const i = this.activeIndex();
          if (i >= 0 && i < len) this.select(opts[i]);
        }
        break;

      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.isOpen.set(false);
        } else if (this.query()) {
          event.preventDefault();
          this.clear();
        }
        break;

      case 'Tab':
        if (this.isOpen()) {
          const i = this.activeIndex();
          if (i >= 0 && i < len) this.select(opts[i]);
          else this.isOpen.set(false);
        }
        break;
    }
  }

  protected onDocumentPointerDown(event: PointerEvent): void {
    if (this.isOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }
}
