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
            urgent: '4px solid #ef4444',
            high: '4px solid #f59e0b',
            medium: '4px solid #6366f1',
            low: '4px solid #22c55e',
        };
        return colorMap[this.priority()] ?? colorMap['medium'];
    });
}
