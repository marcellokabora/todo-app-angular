import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeTime', pure: true })
export class RelativeTimePipe implements PipeTransform {
    transform(value: string | Date | null | undefined): string {
        if (!value) return '';

        const date = typeof value === 'string' ? new Date(value) : value;
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        if (diffSec < 0) {
            // Future dates
            const absDays = Math.abs(diffDay);
            if (absDays === 0) return 'today';
            if (absDays === 1) return 'tomorrow';
            if (absDays < 7) return `in ${absDays} days`;
            if (absDays < 30) return `in ${Math.floor(absDays / 7)} weeks`;
            return `in ${Math.floor(absDays / 30)} months`;
        }

        if (diffSec < 60) return 'just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        if (diffDay === 1) return 'yesterday';
        if (diffDay < 7) return `${diffDay}d ago`;
        if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
        return `${Math.floor(diffDay / 30)}mo ago`;
    }
}
