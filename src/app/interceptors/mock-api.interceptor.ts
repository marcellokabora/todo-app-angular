import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, delay } from 'rxjs';
import { TaskService } from '../services/task.service';

/**
 * Mock API interceptor — intercepts calls to /api/tasks and returns data from TaskService.
 * This simulates a real backend for demonstrating httpResource() and resource().
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
    const taskService = inject(TaskService);

    // GET /api/tasks
    if (req.url.includes('/api/tasks') && req.method === 'GET') {
        const idMatch = req.url.match(/\/api\/tasks\/(.+)/);
        if (idMatch) {
            const task = taskService.getTaskById(idMatch[1]);
            return of(new HttpResponse({ status: task ? 200 : 404, body: task ?? null })).pipe(
                delay(300),
            );
        }
        return of(new HttpResponse({ status: 200, body: taskService.tasks() })).pipe(delay(500));
    }

    // Pass through all other requests
    return next(req);
};
