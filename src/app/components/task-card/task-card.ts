import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../../models/task.model';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';
import { fadeInOut } from '../../animations/task.animations';

@Component({
  selector: 'app-task-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RelativeTimePipe, HighlightDirective, RouterLink],
  animations: [fadeInOut],
  template: `
    <div
      @fadeInOut
      appHighlight
      [priority]="task().priority"
      [completed]="task().completed"
      class="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md"
      [attr.aria-label]="'Task: ' + task().title"
    >
      <div class="mb-2 flex items-start justify-between">
        <div class="flex items-center gap-2">
          <button
            (click)="toggleCompleted.emit(task().id)"
            class="flex h-5 w-5 items-center justify-center rounded border-2 transition-colors"
            [class]="task().completed
              ? 'border-green-500 bg-green-500 text-white'
              : 'border-gray-300 hover:border-indigo-400'"
            [attr.aria-label]="task().completed ? 'Mark as incomplete' : 'Mark as complete'"
          >
            @if (task().completed) {
              <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
              </svg>
            }
          </button>
          <a
            [routerLink]="['/task', task().id]"
            class="text-sm font-semibold text-gray-900 hover:text-indigo-600 hover:underline"
            [class.line-through]="task().completed"
            [class.text-gray-400]="task().completed"
          >
            {{ task().title }}
          </a>
        </div>
        <div class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            (click)="deleted.emit(task().id)"
            class="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
            aria-label="Delete task"
          >
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      @if (task().description) {
        <p class="mb-3 line-clamp-2 text-xs text-gray-500">
          {{ task().description }}
        </p>
      }

      <div class="mb-2 flex flex-wrap gap-1">
        <span [class]="priorityBadge()">
          {{ task().priority }}
        </span>
        <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {{ task().category }}
        </span>
        @for (tag of task().tags; track tag) {
          <span class="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
            {{ tag }}
          </span>
        }
      </div>

      <div class="flex items-center justify-between text-xs text-gray-400">
        <span>{{ task().assignee }}</span>
        <span [class]="dueDateClass()">
          Due {{ task().dueDate | relativeTime }}
        </span>
      </div>
    </div>
  `,
})
export class TaskCardComponent {
  readonly task = input.required<Task>();
  readonly toggleCompleted = output<string>();
  readonly deleted = output<string>();

  protected readonly priorityBadge = computed(() => {
    const base = 'rounded-full px-2 py-0.5 text-xs font-medium capitalize';
    const colorMap: Record<string, string> = {
      urgent: 'bg-red-100 text-red-700',
      high: 'bg-amber-100 text-amber-700',
      medium: 'bg-indigo-100 text-indigo-700',
      low: 'bg-green-100 text-green-700',
    };
    return `${base} ${colorMap[this.task().priority] ?? colorMap['medium']}`;
  });

  protected readonly dueDateClass = computed(() => {
    const dueDate = new Date(this.task().dueDate);
    const now = new Date();
    if (this.task().completed) return 'text-gray-400';
    if (dueDate < now) return 'text-red-500 font-medium';
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 2) return 'text-amber-500 font-medium';
    return 'text-gray-400';
  });
}
