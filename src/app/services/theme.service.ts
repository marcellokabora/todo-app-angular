import { effect, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    readonly isDark = signal(
        typeof localStorage !== 'undefined' && localStorage.getItem('theme') === 'dark',
    );

    constructor() {
        // Keep <html> class and localStorage in sync with the signal
        effect(() => {
            const dark = this.isDark();
            document.documentElement.classList.toggle('dark', dark);
            localStorage.setItem('theme', dark ? 'dark' : 'light');
        });
    }

    toggle(): void {
        this.isDark.update((v) => !v);
    }
}
