import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskCardComponent } from '../task-card/task-card';
import { staggerList } from '../../animations/task.animations';

@Component({
  selector: 'app-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskCardComponent],
  animations: [staggerList],
  template: `
    @if (taskService.filteredTasks().length === 0) {
      <div class="flex flex-col items-center justify-center py-12 text-muted">
        <svg class="mb-4 h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-lg font-medium">No tasks found</p>
        <p class="text-sm">Try adjusting your filters or create a new task</p>
      </div>
    } @else {
      <div class="grid gap-3" [@staggerList]="taskService.filteredTasks().length">
        @for (task of taskService.filteredTasks(); track task.id) {
          <app-task-card
            [task]="task"
            (toggleCompleted)="taskService.toggleComplete($event)"
            (deleted)="confirmDelete($event)"
          />
        }
      </div>
    }
  `,
})
export class TaskListComponent {
  protected readonly taskService = inject(TaskService);

  confirmDelete(taskId: string): void {
    const shouldDelete = confirm('Delete this task? This action cannot be undone.');
    if (!shouldDelete) return;

    this.taskService.deleteTask(taskId);
  }
}
