import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 class="text-6xl font-bold text-border">404</h1>
      <p class="mt-4 text-lg font-medium text-body">Page not found</p>
      <p class="mt-1 text-sm text-muted">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        routerLink="/tasks"
        class="mt-6 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Go to Tasks
      </a>
    </div>
  `,
})
export default class NotFoundComponent { }
