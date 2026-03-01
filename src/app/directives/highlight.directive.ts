import { computed, Directive, input } from '@angular/core';

@Directive({
    selector: '[appHighlight]',
    host: {
        '[style.borderLeft]': 'borderStyle()',
        '[class.opacity-60]': 'isCompleted()',
    },
})
export class HighlightDirective {
    /** The priority level determines the border color */
    readonly priority = input<string>('medium');

    /** Whether the item is completed (dims the element) */
    readonly completed = input(false);

    protected readonly isCompleted = computed(() => this.completed());

    protected readonly borderStyle = computed(() => {
        const colorMap: Record<string, string> = {
            urgent: '4px solid var(--color-danger)',
            high: '4px solid var(--color-warning)',
            medium: '4px solid var(--color-accent)',
            low: '4px solid var(--color-success)',
        };
        return colorMap[this.priority()] ?? colorMap['medium'];
    });
}
