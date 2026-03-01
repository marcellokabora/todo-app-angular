export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type TaskCategory = 'work' | 'personal' | 'health' | 'finance' | 'learning';

export type TaskTag =
    | 'frontend'
    | 'backend'
    | 'design'
    | 'bug'
    | 'feature'
    | 'docs'
    | 'testing'
    | 'devops'
    | 'research'
    | 'meeting';

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    category: TaskCategory;
    tags: TaskTag[];
    assignee: string;
    dueDate: string; // ISO date string
    createdAt: string; // ISO date string
    completed: boolean;
}

export interface TaskFormData {
    title: string;
    description: string;
    priority: TaskPriority;
    category: TaskCategory | '';
    tags: TaskTag[];
    assignee: string;
    dueDate: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

export const ALL_CATEGORIES: { value: TaskCategory; label: string }[] = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'finance', label: 'Finance' },
    { value: 'learning', label: 'Learning' },
];

export const ALL_TAGS: { value: TaskTag; label: string }[] = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'design', label: 'Design' },
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature' },
    { value: 'docs', label: 'Docs' },
    { value: 'testing', label: 'Testing' },
    { value: 'devops', label: 'DevOps' },
    { value: 'research', label: 'Research' },
    { value: 'meeting', label: 'Meeting' },
];

export const ALL_PRIORITIES: { value: TaskPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

export const ALL_STATUSES: { value: TaskStatus; label: string }[] = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
];
