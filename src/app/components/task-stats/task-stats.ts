import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
  untracked,
} from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CardComponent } from '../card/card';

@Component({
  selector: 'app-task-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent],
  template: `
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <!-- Total -->
      <app-card>
        <div card-body>
          <p class="text-sm text-muted">Total Tasks</p>
          <p class="text-3xl font-bold text-heading">{{ stats().total }}</p>
        </div>
      </app-card>

      <!-- Completed -->
      <app-card>
        <div card-body>
          <p class="text-sm text-muted">Completed</p>
          <p class="text-3xl font-bold text-green-600">{{ stats().completed }}</p>
          <div class="mt-1 h-1.5 w-full rounded-full bg-surface-hover">
            <div
              class="h-1.5 rounded-full bg-green-500 transition-all"
              [style.width.%]="completionRate()"
            ></div>
          </div>
        </div>
      </app-card>

      <!-- Pending -->
      <app-card>
        <div card-body>
          <p class="text-sm text-muted">Pending</p>
          <p class="text-3xl font-bold text-amber-600">{{ stats().pending }}</p>
        </div>
      </app-card>

      <!-- Urgent -->
      <app-card>
        <div card-body>
          <p class="text-sm text-muted">Urgent</p>
          <p class="text-3xl font-bold text-red-600">{{ stats().byPriority.urgent }}</p>
        </div>
      </app-card>
    </div>

    <!-- By Priority breakdown -->
    <div class="mt-6">
      <h3 class="mb-3 text-sm font-semibold text-body">By Priority</h3>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        @for (p of priorityBreakdown(); track p.label) {
          <div class="rounded-lg border border-border bg-surface p-3">
            <p class="text-xs text-muted">{{ p.label }}</p>
            <p class="text-xl font-bold" [class]="p.colorClass">{{ p.count }}</p>
          </div>
        }
      </div>
    </div>

    <!-- By Status breakdown -->
    <div class="mt-6">
      <h3 class="mb-3 text-sm font-semibold text-body">By Status</h3>
      <div class="grid grid-cols-3 gap-3">
        @for (s of statusBreakdown(); track s.label) {
          <div class="rounded-lg border border-border bg-surface p-3">
            <p class="text-xs text-muted">{{ s.label }}</p>
            <p class="text-xl font-bold text-heading">{{ s.count }}</p>
          </div>
        }
      </div>
    </div>

    <!-- Simulated async stats via resource() -->
    @defer (on viewport) {
      <div class="mt-6 rounded-lg border border-accent-lighter bg-accent-light p-4">
        <h3 class="mb-2 text-sm font-semibold text-accent-text-dark">Async Stats (resource)</h3>
        @if (asyncStats.isLoading()) {
          <div class="flex items-center gap-2 text-sm text-accent-text">
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
            Loading statistics...
          </div>
        } @else if (asyncStats.value(); as data) {
          <p class="text-sm text-accent-text">
            Productivity score: <strong>{{ data.score }}%</strong>
            — You've completed {{ data.completed }} of {{ data.total }} tasks this period.
          </p>
        } @else {
          <p class="text-sm text-red-500">Failed to load statistics.</p>
        }
      </div>
    } @placeholder {
      <div class="mt-6 h-24 rounded-lg border border-border bg-surface-alt flex items-center justify-center text-sm text-muted">
        Scroll down to load async stats
      </div>
    } @loading {
      <div class="mt-6 h-24 animate-pulse rounded-lg bg-surface-hover"></div>
    }
  `,
})
export class TaskStatsComponent {
  private readonly taskService = inject(TaskService);

  readonly stats = this.taskService.taskStats;

  readonly completionRate = computed(() => {
    const s = this.stats();
    return s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
  });

  readonly priorityBreakdown = computed(() => [
    { label: 'Low', count: this.stats().byPriority.low, colorClass: 'text-green-600' },
    { label: 'Medium', count: this.stats().byPriority.medium, colorClass: 'text-accent-text' },
    { label: 'High', count: this.stats().byPriority.high, colorClass: 'text-amber-600' },
    { label: 'Urgent', count: this.stats().byPriority.urgent, colorClass: 'text-red-600' },
  ]);

  readonly statusBreakdown = computed(() => [
    { label: 'To Do', count: this.stats().byStatus.todo },
    { label: 'In Progress', count: this.stats().byStatus['in-progress'] },
    { label: 'Done', count: this.stats().byStatus.done },
  ]);

  /** Simulated async stat computation using resource() */
  readonly asyncStats = resource({
    loader: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const s = this.stats();
      return {
        total: s.total,
        completed: s.completed,
        score: s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0,
      };
    },
  });

  constructor() {
    // Effect that logs stat changes and updates document title
    effect(() => {
      const s = this.stats();
      // Read stats reactively, but use untracked() for the console log
      // to demonstrate untracked() usage
      untracked(() => {
        console.log('[TaskStats] Updated:', s);
        document.title = `Tasks (${s.pending} pending) — Task Manager`;
      });
    });
  }
}
