import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { form, FormField, required, minLength, maxLength, validate } from '@angular/forms/signals';
import { Task, TaskCategory, TaskFormData, ALL_CATEGORIES, ALL_TAGS, ALL_PRIORITIES } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { AriaSelectComponent } from '../aria-select/aria-select';
import { AriaMultiselectComponent } from '../aria-multiselect/aria-multiselect';
import { AriaAutocompleteComponent } from '../aria-autocomplete/aria-autocomplete';

@Component({
    selector: 'app-task-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormField,
        AriaSelectComponent,
        AriaMultiselectComponent,
        AriaAutocompleteComponent,
    ],
    templateUrl: './task-form.html',
})
export class TaskFormComponent {
    private readonly taskService = inject(TaskService);
    private readonly userService = inject(UserService);

    readonly task = input<Task | undefined>(undefined);
    readonly taskSaved = output<string>();

    /** Category options for the Aria Select */
    readonly categoryOptions = ALL_CATEGORIES;
    /** Tag options for the Aria Multiselect */
    readonly tagOptions = ALL_TAGS;
    /** Priority options for the Aria Select */
    readonly priorityOptions = ALL_PRIORITIES;

    /** User options for the Aria Autocomplete */
    readonly userOptions = computed(() =>
        this.userService.users().map((u) => ({ value: u.name, label: u.name })),
    );

    readonly submitLabel = computed(() => (this.task() ? 'Save Changes' : 'Add Task'));

    /** The form model — a signal holding the form data */
    readonly taskModel = signal<TaskFormData>({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        tags: [],
        assignee: '',
        dueDate: '',
    });

    constructor() {
        effect(() => {
            const task = this.task();
            this.taskModel.set(task ? taskToFormData(task) : createEmptyTaskFormData());
        });
    }

    /** Signal Form with validation schema */
    readonly taskForm = form(this.taskModel, (p) => {
        required(p.title);
        minLength(p.title, 3);
        maxLength(p.title, 100);

        maxLength(p.description, 500);

        required(p.priority);
        required(p.category);

        validate(p.tags, (ctx) =>
            ctx.value().length === 0
                ? { kind: 'minTags', message: 'Select at least one tag' }
                : undefined,
        );

        required(p.assignee);

        required(p.dueDate);
        validate(p.dueDate, (ctx) => {
            const date = ctx.value();
            if (!date) return undefined;
            const selected = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selected < today
                ? { kind: 'futureDate', message: 'Due date must be today or later' }
                : undefined;
        });
    });

    /** Whether the form is valid */
    readonly isFormValid = computed(() => this.taskForm().valid());

    /** Submit handler */
    onSubmit(event: SubmitEvent): void {
        event.preventDefault();
        if (!this.taskForm().valid()) return;

        const data = this.taskModel();
        const currentTask = this.task();

        if (currentTask) {
            this.taskService.updateTask(currentTask.id, {
                title: data.title,
                description: data.description,
                priority: data.priority,
                category: data.category as TaskCategory,
                tags: data.tags,
                assignee: data.assignee,
                dueDate: data.dueDate,
            });
            this.taskSaved.emit(currentTask.id);
            return;
        }

        const newId = this.taskService.addTask({
            title: data.title,
            description: data.description,
            priority: data.priority,
            status: 'todo',
            category: data.category as TaskCategory,
            tags: data.tags,
            assignee: data.assignee,
            dueDate: data.dueDate,
        });

        this.taskModel.set(createEmptyTaskFormData());
        this.taskSaved.emit(newId);
    }
}

function createEmptyTaskFormData(): TaskFormData {
    return {
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        tags: [],
        assignee: '',
        dueDate: '',
    };
}

function taskToFormData(task: Task): TaskFormData {
    return {
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        tags: [...task.tags],
        assignee: task.assignee,
        dueDate: task.dueDate,
    };
}
