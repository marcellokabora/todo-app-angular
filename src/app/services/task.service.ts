import { computed, effect, Injectable, linkedSignal, resource, signal } from '@angular/core';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../models/task.model';

const STORAGE_KEY = 'mock-tasks';

const MOCK_TASKS: Task[] = [
    {
        id: '1',
        title: 'Implement authentication flow',
        description: 'Set up OAuth2 login with Google and GitHub providers. Include token refresh logic.',
        priority: 'high',
        status: 'in-progress',
        category: 'work',
        tags: ['frontend', 'backend', 'feature'],
        assignee: 'Alice Johnson',
        dueDate: '2026-03-10',
        createdAt: '2026-02-20T10:00:00Z',
        completed: false,
    },
    {
        id: '2',
        title: 'Fix navigation bug on mobile',
        description: 'The hamburger menu does not close after selecting a link on iOS Safari.',
        priority: 'urgent',
        status: 'todo',
        category: 'work',
        tags: ['frontend', 'bug'],
        assignee: 'Bob Smith',
        dueDate: '2026-03-03',
        createdAt: '2026-02-25T14:30:00Z',
        completed: false,
    },
    {
        id: '3',
        title: 'Write unit tests for task service',
        description: 'Achieve 90%+ coverage on TaskService including edge cases for CRUD operations.',
        priority: 'medium',
        status: 'todo',
        category: 'work',
        tags: ['testing', 'backend'],
        assignee: 'Charlie Davis',
        dueDate: '2026-03-15',
        createdAt: '2026-02-22T09:00:00Z',
        completed: false,
    },
    {
        id: '4',
        title: 'Design system documentation',
        description: 'Document all shared UI components, their props, and usage examples in Storybook.',
        priority: 'low',
        status: 'done',
        category: 'work',
        tags: ['docs', 'design'],
        assignee: 'Diana Chen',
        dueDate: '2026-02-28',
        createdAt: '2026-02-10T11:00:00Z',
        completed: true,
    },
    {
        id: '5',
        title: 'Morning run - 5K',
        description: 'Complete a 5K run at the park. Target pace: 5:30/km.',
        priority: 'medium',
        status: 'todo',
        category: 'health',
        tags: ['research'],
        assignee: 'Alice Johnson',
        dueDate: '2026-03-02',
        createdAt: '2026-02-28T07:00:00Z',
        completed: false,
    },
    {
        id: '6',
        title: 'Review Q1 budget',
        description: 'Analyze spending vs. budget for January-March. Prepare summary for team meeting.',
        priority: 'high',
        status: 'in-progress',
        category: 'finance',
        tags: ['meeting', 'research'],
        assignee: 'Eve Martinez',
        dueDate: '2026-03-05',
        createdAt: '2026-02-18T16:00:00Z',
        completed: false,
    },
    {
        id: '7',
        title: 'Complete Angular 21 tutorial',
        description: 'Work through the official Angular 21 signals and Signal Forms tutorials.',
        priority: 'medium',
        status: 'in-progress',
        category: 'learning',
        tags: ['frontend', 'research'],
        assignee: 'Frank Wilson',
        dueDate: '2026-03-12',
        createdAt: '2026-02-23T13:00:00Z',
        completed: false,
    },
    {
        id: '8',
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for build, test, and deploy. Add staging environment.',
        priority: 'high',
        status: 'todo',
        category: 'work',
        tags: ['devops', 'backend'],
        assignee: 'Grace Lee',
        dueDate: '2026-03-08',
        createdAt: '2026-02-19T10:30:00Z',
        completed: false,
    },
    {
        id: '9',
        title: 'Plan weekend trip',
        description: 'Research destinations, book accommodation, and plan itinerary for the family trip.',
        priority: 'low',
        status: 'todo',
        category: 'personal',
        tags: ['research'],
        assignee: 'Henry Brown',
        dueDate: '2026-03-20',
        createdAt: '2026-02-27T19:00:00Z',
        completed: false,
    },
    {
        id: '10',
        title: 'Refactor dashboard components',
        description: 'Break down the monolithic dashboard into smaller, reusable signal-based components.',
        priority: 'medium',
        status: 'done',
        category: 'work',
        tags: ['frontend', 'feature'],
        assignee: 'Alice Johnson',
        dueDate: '2026-02-25',
        createdAt: '2026-02-12T08:00:00Z',
        completed: true,
    },
];

@Injectable({ providedIn: 'root' })
export class TaskService {
    /** Primary task state — seeded from localStorage, falls back to MOCK_TASKS */
    readonly tasks = signal<Task[]>(this.#loadTasks());

    constructor() {
        // Persist any change to localStorage automatically
        effect(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks()));
        });
    }

    #loadTasks(): Task[] {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored) as Task[];
        } catch {
            // Storage unavailable or data corrupted — fall back to mock data
        }
        return MOCK_TASKS;
    }

    /** Filter state — resets to 'all' when tasks change */
    readonly selectedStatusFilter = linkedSignal<Task[], TaskStatus | 'all'>({
        source: this.tasks,
        computation: () => 'all',
    });

    readonly selectedPriorityFilter = signal<TaskPriority | 'all'>('all');

    /** Derived state */
    readonly completedTasks = computed(() => this.tasks().filter((t) => t.completed));

    readonly pendingTasks = computed(() => this.tasks().filter((t) => !t.completed));

    readonly filteredTasks = computed(() => {
        const status = this.selectedStatusFilter();
        const priority = this.selectedPriorityFilter();
        return this.tasks().filter((t) => {
            const statusMatch = status === 'all' || t.status === status;
            const priorityMatch = priority === 'all' || t.priority === priority;
            return statusMatch && priorityMatch;
        });
    });

    readonly tasksByCategory = computed(() => {
        const map = new Map<TaskCategory, Task[]>();
        for (const task of this.tasks()) {
            const list = map.get(task.category) ?? [];
            list.push(task);
            map.set(task.category, list);
        }
        return map;
    });

    readonly taskStats = computed(() => {
        const all = this.tasks();
        return {
            total: all.length,
            completed: all.filter((t) => t.completed).length,
            pending: all.filter((t) => !t.completed).length,
            byPriority: {
                low: all.filter((t) => t.priority === 'low').length,
                medium: all.filter((t) => t.priority === 'medium').length,
                high: all.filter((t) => t.priority === 'high').length,
                urgent: all.filter((t) => t.priority === 'urgent').length,
            },
            byStatus: {
                todo: all.filter((t) => t.status === 'todo').length,
                'in-progress': all.filter((t) => t.status === 'in-progress').length,
                done: all.filter((t) => t.status === 'done').length,
            },
        };
    });

    /** Simulated async task loading using resource() */
    readonly asyncTasks = resource({
        loader: async () => {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 800));
            return this.tasks();
        },
    });

    getTaskById(id: string): Task | undefined {
        return this.tasks().find((t) => t.id === id);
    }

    addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>): string {
        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            completed: taskData.status === 'done',
        };
        this.tasks.update((tasks) => [newTask, ...tasks]);
        return newTask.id;
    }

    updateTask(id: string, updates: Partial<Task>): void {
        this.tasks.update((tasks) => tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    }

    deleteTask(id: string): void {
        this.tasks.update((tasks) => tasks.filter((t) => t.id !== id));
    }

    toggleComplete(id: string): void {
        this.tasks.update((tasks) =>
            tasks.map((t) =>
                t.id === id
                    ? { ...t, completed: !t.completed, status: !t.completed ? 'done' : 'todo' as TaskStatus }
                    : t,
            ),
        );
    }

}
