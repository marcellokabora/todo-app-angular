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
  selector: 'app-aria-multiselect',
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
        class="flex min-h-9.5 w-full flex-wrap items-center gap-1.5 rounded-lg border bg-surface px-3 py-1.5 text-sm text-heading transition-colors focus:outline-none focus:ring-1 focus:ring-accent-ring"
        [class]="isOpen()
          ? 'border-accent-ring ring-1 ring-accent-ring'
          : 'border-input-border hover:border-muted'"
      >
        @if (selectedOptions().length === 0) {
          <span class="text-placeholder">{{ placeholder() }}</span>
        } @else {
          @for (opt of selectedOptions(); track opt.value) {
            <span
              class="inline-flex items-center gap-1 rounded-full bg-accent-lighter px-2 py-0.5 text-xs font-medium text-accent-text-dark"
            >
              {{ opt.label }}
              <span
                role="button"
                tabindex="-1"
                [attr.aria-label]="'Remove ' + opt.label"
                (click)="removeChip(opt.value, $event)"
                (keydown.enter)="removeChip(opt.value, $event)"
                (keydown.space)="removeChip(opt.value, $event)"
                class="cursor-pointer rounded-full p-0.5 hover:bg-accent-light focus:outline-none focus:ring-1 focus:ring-accent-ring"
                aria-hidden="false"
              >
                <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </span>
            </span>
          }
        }
        <svg
          class="ml-auto h-4 w-4 shrink-0 text-placeholder transition-transform duration-150"
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
          aria-multiselectable="true"
          [attr.aria-label]="label()"
          tabindex="-1"
          class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-surface py-1 shadow-lg focus:outline-none"
        >
          @for (opt of options(); track opt.value; let i = $index) {
            <li
              [id]="optionId(i)"
              role="option"
              [attr.aria-selected]="isSelected(opt.value)"
              (click)="toggleOption(opt.value)"
              (mouseenter)="activeIndex.set(i)"
              class="flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-sm transition-colors"
              [class]="optionClass(opt.value, i)"
            >
              <!-- Custom checkbox indicator -->
              <span
                class="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors"
                [class]="isSelected(opt.value)
                  ? 'border-accent bg-accent'
                  : 'border-input-border bg-surface'"
                aria-hidden="true"
              >
                @if (isSelected(opt.value)) {
                  <svg class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                }
              </span>
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
export class AriaMultiselectComponent {
  readonly value = model<string[]>([]);
  readonly options = input<{ value: string; label: string }[]>([]);
  readonly label = input('Select options');
  readonly placeholder = input('Select...');

  protected readonly listboxId = `listbox-multi-${Math.random().toString(36).slice(2)}`;
  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(0);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly triggerBtn = viewChild<ElementRef<HTMLButtonElement>>('triggerBtn');

  protected readonly selectedOptions = computed(() =>
    this.options().filter((o) => this.value().includes(o.value)),
  );

  protected readonly activeDescendant = computed(() => {
    const i = this.activeIndex();
    return this.isOpen() && i >= 0 ? this.optionId(i) : null;
  });

  protected optionId(index: number): string {
    return `${this.listboxId}-opt-${index}`;
  }

  protected isSelected(val: string): boolean {
    return this.value().includes(val);
  }

  protected optionClass(val: string, index: number): string {
    const active = index === this.activeIndex();
    const selected = this.isSelected(val);
    if (active && selected) return 'bg-accent-light text-accent-text-dark font-medium';
    if (active) return 'bg-accent-light text-accent-text-dark';
    if (selected) return 'font-medium text-accent-text';
    return 'text-body hover:bg-surface-hover';
  }

  protected toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  protected open(): void {
    this.activeIndex.set(0);
    this.isOpen.set(true);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected toggleOption(val: string): void {
    const current = this.value();
    this.value.set(
      current.includes(val) ? current.filter((v) => v !== val) : [...current, val],
    );
  }

  protected removeChip(val: string, event: Event): void {
    event.stopPropagation();
    this.value.update((current) => current.filter((v) => v !== val));
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

      case ' ':
      case 'Enter':
        event.preventDefault();
        if (this.isOpen()) {
          const i = this.activeIndex();
          if (i >= 0 && i < len) this.toggleOption(opts[i].value);
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
