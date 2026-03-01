import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';

export const taskResolver: ResolveFn<Task | undefined> = (route) => {
    const taskService = inject(TaskService);
    const id = route.paramMap.get('id');
    return id ? taskService.getTaskById(id) : undefined;
};
