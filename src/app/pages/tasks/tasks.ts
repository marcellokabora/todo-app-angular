import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskListComponent } from '../../components/task-list/task-list';
import { ALL_STATUSES, ALL_PRIORITIES } from '../../models/task.model';

@Component({
  selector: 'app-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskListComponent],
  template: `
    <div class="mx-auto max-w-5xl px-4 py-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-heading">All Tasks</h1>
        <p class="text-sm text-muted">
          {{ taskService.taskStats().total }} tasks ·
          {{ taskService.taskStats().completed }} completed ·
          {{ taskService.taskStats().pending }} pending
        </p>
      </div>

      <!-- Filters -->
      <div class="mb-4 flex flex-wrap gap-2">
        <span class="self-center text-xs font-medium text-muted">Status:</span>
        @for (s of statuses; track s.value) {
          <button
            (click)="taskService.selectedStatusFilter.set(s.value)"
            class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
            [class]="taskService.selectedStatusFilter() === s.value
              ? 'bg-accent text-white'
              : 'bg-surface-hover text-body hover:bg-border'"
          >
            {{ s.label }}
          </button>
        }
        <span class="ml-2 self-center text-xs font-medium text-muted">Priority:</span>
        @for (p of priorities; track p.value) {
          <button
            (click)="taskService.selectedPriorityFilter.set(p.value)"
            class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
            [class]="taskService.selectedPriorityFilter() === p.value
              ? 'bg-accent text-white'
              : 'bg-surface-hover text-body hover:bg-border'"
          >
            {{ p.label }}
          </button>
        }
      </div>

      <app-task-list />
    </div>
  `,
})
export default class TasksComponent {
  protected readonly taskService = inject(TaskService);

  readonly statuses = [{ value: 'all' as const, label: 'All' }, ...ALL_STATUSES];
  readonly priorities = [{ value: 'all' as const, label: 'All' }, ...ALL_PRIORITIES];
}
