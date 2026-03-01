import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { taskResolver } from './resolvers/task.resolver';

export const routes: Routes = [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    {
        path: 'tasks',
        loadComponent: () => import('./pages/tasks/tasks'),
    },
    {
        path: 'add-task',
        loadComponent: () => import('./pages/add-task/add-task'),
    },
    {
        path: 'statistics',
        loadComponent: () => import('./pages/statistics/statistics'),
    },
    {
        path: 'task/:id',
        loadComponent: () => import('./pages/task-detail/task-detail'),
        canActivate: [authGuard],
        resolve: { task: taskResolver },
    },
    {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found'),
    },
];
