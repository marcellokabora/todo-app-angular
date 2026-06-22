import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AccordionGroup,
  AccordionTrigger,
  AccordionPanel,
  AccordionContent,
} from '@angular/aria/accordion';
import { Task } from '../../models/task.model';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';
import { CardComponent } from '../../components/card/card';
import { fadeInOut, expandCollapse } from '../../animations/task.animations';

@Component({
  selector: 'app-task-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AccordionGroup,
    AccordionTrigger,
    AccordionPanel,
    AccordionContent,
    RelativeTimePipe,
    HighlightDirective,
    CardComponent,
  ],
  animations: [fadeInOut, expandCollapse],
  template: `
    @if (task(); as t) {
      <div class="mx-auto max-w-3xl px-4 py-6" @fadeInOut>
        <!-- Back link -->
        <a
          routerLink="/tasks"
          class="mb-4 inline-flex items-center gap-1 text-sm text-accent-text hover:text-accent-hover"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
          </svg>
          Back to Tasks
        </a>

        <!-- Task Header -->
        <div
          appHighlight
          [priority]="t.priority"
          [completed]="t.completed"
          class="mb-6 rounded-xl border border-border bg-surface p-6"
        >
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-xl font-bold text-heading" [class.line-through]="t.completed">
                {{ t.title }}
              </h1>
              <p class="mt-1 text-sm text-muted">
                Created {{ t.createdAt | relativeTime }} · Due {{ t.dueDate | relativeTime }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <a
                [routerLink]="['/task', t.id, 'edit']"
                class="rounded-md border border-border px-3 py-1 text-xs font-medium text-body transition-colors hover:bg-surface-hover hover:text-accent-text"
              >
                Edit Task
              </a>
              <span [class]="priorityBadge()">{{ t.priority }}</span>
            </div>
          </div>

          <p class="mt-3 text-sm text-body">{{ t.description }}</p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span class="rounded-full bg-surface-hover px-3 py-1 text-xs text-body">
              {{ t.category }}
            </span>
            @for (tag of t.tags; track tag) {
              <span class="rounded-full bg-accent-light px-3 py-1 text-xs text-accent-text">
                {{ tag }}
              </span>
            }
          </div>

          <div class="mt-4 text-sm text-muted">
            Assigned to: <strong class="text-body">{{ t.assignee }}</strong>
          </div>
        </div>

        <!-- Accordion sections -->
        <div ngAccordionGroup multiExpandable class="space-y-3">
          <!-- Details section -->
          <app-card>
            <div card-body>
              <button
                ngAccordionTrigger
                panelId="details"
                [(expanded)]="detailsExpanded"
                class="flex w-full items-center justify-between text-left"
                [attr.aria-expanded]="detailsExpanded()"
              >
                <span class="text-sm font-semibold text-body">Task Details</span>
                <svg
                  class="h-5 w-5 text-placeholder transition-transform"
                  [class.rotate-180]="detailsExpanded()"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>
              <div ngAccordionPanel panelId="details" role="region">
                <ng-template ngAccordionContent>
                  <div class="mt-3 space-y-2 border-t border-border-light pt-3 text-sm text-body">
                    <div class="flex justify-between">
                      <span>Status</span>
                      <span class="font-medium capitalize text-heading">{{ t.status }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Priority</span>
                      <span class="font-medium capitalize text-heading">{{ t.priority }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Category</span>
                      <span class="font-medium capitalize text-heading">{{ t.category }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Completed</span>
                      <span class="font-medium text-heading">{{ t.completed ? 'Yes' : 'No' }}</span>
                    </div>
                  </div>
                </ng-template>
              </div>
            </div>
          </app-card>

          <!-- Activity Log section -->
          <app-card>
            <div card-body>
              <button
                ngAccordionTrigger
                panelId="activity"
                [(expanded)]="activityExpanded"
                class="flex w-full items-center justify-between text-left"
                [attr.aria-expanded]="activityExpanded()"
              >
                <span class="text-sm font-semibold text-body">Activity Log</span>
                <svg
                  class="h-5 w-5 text-placeholder transition-transform"
                  [class.rotate-180]="activityExpanded()"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>
              <div ngAccordionPanel panelId="activity" role="region">
                <ng-template ngAccordionContent>
                  <div class="mt-3 space-y-3 border-t border-border-light pt-3">
                    @for (entry of activityLog(); track entry.date) {
                      <div class="flex items-start gap-3 text-sm">
                        <div class="mt-1 h-2 w-2 rounded-full bg-accent"></div>
                        <div>
                          <p class="text-body">{{ entry.action }}</p>
                          <p class="text-xs text-muted">{{ entry.date | relativeTime }}</p>
                        </div>
                      </div>
                    }
                  </div>
                </ng-template>
              </div>
            </div>
          </app-card>

          <!-- Comments section (deferred) -->
          <app-card>
            <div card-body>
              <button
                ngAccordionTrigger
                panelId="comments"
                [(expanded)]="commentsExpanded"
                class="flex w-full items-center justify-between text-left"
                [attr.aria-expanded]="commentsExpanded()"
              >
                <span class="text-sm font-semibold text-body">Comments</span>
                <svg
                  class="h-5 w-5 text-placeholder transition-transform"
                  [class.rotate-180]="commentsExpanded()"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>
              <div ngAccordionPanel panelId="comments" role="region">
                @defer (on viewport) {
                  <div class="mt-3 space-y-3 border-t border-border-light pt-3">
                    @for (comment of comments(); track comment.id) {
                      <div class="rounded-lg bg-surface-alt p-3 text-sm">
                        <div class="flex items-center justify-between">
                          <span class="font-medium text-body">{{ comment.author }}</span>
                          <span class="text-xs text-muted">{{ comment.date | relativeTime }}</span>
                        </div>
                        <p class="mt-1 text-body">{{ comment.text }}</p>
                      </div>
                    }
                  </div>
                } @placeholder {
                  <div class="mt-3 border-t border-border-light pt-3 text-center text-sm text-muted">
                    Scroll to load comments
                  </div>
                } @loading {
                  <div class="mt-3 space-y-2 border-t border-border-light pt-3">
                    <div class="h-16 animate-pulse rounded-lg bg-surface-hover"></div>
                    <div class="h-16 animate-pulse rounded-lg bg-surface-hover"></div>
                  </div>
                }
              </div>
            </div>
          </app-card>
        </div>
      </div>
    } @else {
      <div class="flex flex-col items-center justify-center py-24 text-muted">
        <p class="text-lg">Task not found</p>
        <a routerLink="/tasks" class="mt-2 text-sm text-accent-text hover:underline">
          Return to Tasks
        </a>
      </div>
    }
  `,
})
export default class TaskDetailComponent {
  /** Resolved task from route resolver */
  readonly task = input<Task>();

  readonly detailsExpanded = signal(true);
  readonly activityExpanded = signal(false);
  readonly commentsExpanded = signal(false);

  readonly priorityBadge = computed(() => {
    const t = this.task();
    if (!t) return '';
    const base = 'rounded-full px-3 py-1 text-xs font-medium capitalize';
    const colorMap: Record<string, string> = {
      urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      medium: 'bg-accent-lighter text-accent-text-dark',
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return `${base} ${colorMap[t.priority] ?? colorMap['medium']}`;
  });

  /** Mock activity log */
  readonly activityLog = computed(() => {
    const t = this.task();
    if (!t) return [];
    return [
      { action: `Task created by ${t.assignee}`, date: t.createdAt },
      {
        action: `Status changed to "${t.status}"`,
        date: new Date(new Date(t.createdAt).getTime() + 86400000).toISOString(),
      },
      {
        action: `Priority set to "${t.priority}"`,
        date: new Date(new Date(t.createdAt).getTime() + 172800000).toISOString(),
      },
    ];
  });

  /** Mock comments */
  readonly comments = computed(() => {
    const t = this.task();
    if (!t) return [];
    return [
      {
        id: '1',
        author: t.assignee,
        text: 'Started working on this task. Will update with progress.',
        date: t.createdAt,
      },
      {
        id: '2',
        author: 'Eve Martinez',
        text: 'Let me know if you need any help with this!',
        date: new Date(new Date(t.createdAt).getTime() + 3600000).toISOString(),
      },
    ];
  });
}
