import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';

@Pipe({ name: 'taskFilter', pure: true })
export class TaskFilterPipe implements PipeTransform {
    transform(
        tasks: Task[],
        status?: TaskStatus | 'all',
        priority?: TaskPriority | 'all',
    ): Task[] {
        if (!tasks) return [];

        return tasks.filter((task) => {
            const statusMatch = !status || status === 'all' || task.status === status;
            const priorityMatch = !priority || priority === 'all' || task.priority === priority;
            return statusMatch && priorityMatch;
        });
    }
}
