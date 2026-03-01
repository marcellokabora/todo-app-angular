import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TabList, Tab, TabPanel, TabContent, Tabs } from '@angular/aria/tabs';
import { TaskService } from '../../services/task.service';
import { TaskListComponent } from '../../components/task-list/task-list';
import { TaskFormComponent } from '../../components/task-form/task-form';
import { TaskStatsComponent } from '../../components/task-stats/task-stats';
import { ALL_STATUSES, ALL_PRIORITIES } from '../../models/task.model';
import { fadeInOut } from '../../animations/task.animations';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabContent,
    TaskListComponent,
    TaskFormComponent,
    TaskStatsComponent,
  ],
  animations: [fadeInOut],
  template: `
    <div class="mx-auto max-w-5xl px-4 py-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-heading">Dashboard</h1>
        <p class="text-sm text-muted">
          {{ taskService.taskStats().total }} tasks ·
          {{ taskService.taskStats().completed }} completed ·
          {{ taskService.taskStats().pending }} pending
        </p>
      </div>

      <div ngTabs>
        <div
          ngTabList
          [(selectedTab)]="selectedTab"
          class="mb-6 flex gap-1 rounded-lg bg-surface-hover p-1"
          aria-label="Dashboard tabs"
        >
          <button
            ngTab value="tasks"
            class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            [class]="selectedTab() === 'tasks'
              ? 'bg-surface text-accent-text-dark shadow-sm'
              : 'text-body hover:text-heading'"
          >
            All Tasks
          </button>
          <button
            ngTab value="add"
            class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            [class]="selectedTab() === 'add'
              ? 'bg-surface text-accent-text-dark shadow-sm'
              : 'text-body hover:text-heading'"
          >
            Add Task
          </button>
          <button
            ngTab value="stats"
            class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            [class]="selectedTab() === 'stats'
              ? 'bg-surface text-accent-text-dark shadow-sm'
              : 'text-body hover:text-heading'"
          >
            Statistics
          </button>
        </div>

        <!-- Tasks Tab Panel -->
        <div ngTabPanel value="tasks">
          <ng-template ngTabContent>
            <div @fadeInOut>
              <!-- Filters -->
              <div class="mb-4 flex flex-wrap gap-2">
                <span class="text-xs font-medium text-muted self-center">Status:</span>
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
                <span class="ml-2 text-xs font-medium text-muted self-center">Priority:</span>
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
          </ng-template>
        </div>

        <!-- Add Task Tab Panel -->
        <div ngTabPanel value="add">
          <ng-template ngTabContent>
            <div @fadeInOut class="mx-auto max-w-2xl">
              <div class="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <h2 class="mb-4 text-lg font-semibold text-heading">Create New Task</h2>
                <app-task-form (taskAdded)="onTaskAdded($event)" />
              </div>
            </div>
          </ng-template>
        </div>

        <!-- Statistics Tab Panel -->
        <div ngTabPanel value="stats">
          <ng-template ngTabContent>
            <div @fadeInOut>
              <app-task-stats />
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
})
export default class DashboardComponent {
  protected readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  readonly selectedTab = signal('tasks');

  readonly statuses = [{ value: 'all' as const, label: 'All' }, ...ALL_STATUSES];
  readonly priorities = [{ value: 'all' as const, label: 'All' }, ...ALL_PRIORITIES];

  onTaskAdded(id: string): void {
    this.router.navigate(['/task', id]);
  }
}
