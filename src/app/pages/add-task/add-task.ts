import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../../components/task-form/task-form';

@Component({
  selector: 'app-add-task',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskFormComponent],
  template: `
    <div class="mx-auto max-w-5xl px-4 py-6">
      <div class="mx-auto max-w-2xl">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p class="text-sm text-gray-500">Fill in the details below to add a new task.</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <app-task-form (taskAdded)="onTaskAdded($event)" />
        </div>
      </div>
    </div>
  `,
})
export default class AddTaskComponent {
  private readonly router = inject(Router);

  onTaskAdded(id: string): void {
    this.router.navigate(['/task', id]);
  }
}
