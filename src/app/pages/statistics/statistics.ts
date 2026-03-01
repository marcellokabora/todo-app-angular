import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TaskStatsComponent } from '../../components/task-stats/task-stats';

@Component({
    selector: 'app-statistics',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TaskStatsComponent],
    template: `
    <div class="mx-auto max-w-5xl px-4 py-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Statistics</h1>
        <p class="text-sm text-gray-500">Overview of your task progress and metrics.</p>
      </div>
      <app-task-stats />
    </div>
  `,
})
export default class StatisticsComponent { }
