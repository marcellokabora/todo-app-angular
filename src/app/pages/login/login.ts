import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AriaAutocompleteComponent } from '../../components/aria-autocomplete/aria-autocomplete';

@Component({
    selector: 'app-login',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, AriaAutocompleteComponent],
    template: `
        <div class="flex min-h-screen items-center justify-center bg-surface-alt px-4">
            <div class="w-full max-w-sm">
                <!-- Logo & heading -->
                <div class="mb-8 text-center">
                    <div
                        class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent"
                    >
                        <svg
                            class="h-8 w-8 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <h1 class="text-2xl font-bold text-heading">Task Manager</h1>
                    <p class="mt-1 text-sm text-muted">Sign in to manage your tasks</p>
                </div>

                <!-- Login form -->
                <form
                    [formGroup]="form"
                    (ngSubmit)="onSubmit()"
                    class="rounded-xl border border-border bg-surface p-6 shadow-sm"
                >
                    @if (errorMessage()) {
                        <div
                            role="alert"
                            class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        >
                            {{ errorMessage() }}
                        </div>
                    }

                    <div class="mb-4">
                        <label for="email" class="mb-1 block text-sm font-medium text-heading">
                            Email
                        </label>
                        <app-aria-autocomplete
                            [(value)]="selectedEmail"
                            [options]="emailOptions()"
                            label="Email"
                            placeholder="Choose your email"
                        />
                        @if (showEmailError()) {
                            <p id="email-error" class="mt-1 text-xs text-red-600 dark:text-red-400">
                                Please enter a valid email address.
                            </p>
                        }
                    </div>

                    <div class="mb-6">
                        <label for="password" class="mb-1 block text-sm font-medium text-heading">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            formControlName="password"
                            autocomplete="current-password"
                            class="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading placeholder-muted outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25"
                            placeholder="Enter password"
                            [attr.aria-describedby]="
                                form.controls.password.invalid && form.controls.password.touched
                                    ? 'password-error'
                                    : null
                            "
                            [attr.aria-invalid]="
                                form.controls.password.invalid && form.controls.password.touched
                            "
                        />
                        @if (form.controls.password.invalid && form.controls.password.touched) {
                            <p
                                id="password-error"
                                class="mt-1 text-xs text-red-600 dark:text-red-400"
                            >
                                Password is required.
                            </p>
                        }
                    </div>

                    <button
                        type="submit"
                        [disabled]="form.invalid"
                        class="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Sign in
                    </button>

                    <p class="mt-4 text-center text-xs text-muted">
                        Pick a registered user email from the dropdown and use password
                        <code class="rounded bg-surface-hover px-1.5 py-0.5 font-mono">1234</code>
                    </p>
                </form>
            </div>
        </div>
    `,
})
export default class LoginComponent {
    private readonly userService = inject(UserService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    protected readonly errorMessage = signal('');
    protected readonly selectedEmail = signal('');

    protected readonly emailOptions = computed(() =>
        this.userService.users().map((user) => ({ value: user.email, label: user.email })),
    );

    protected readonly form = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    protected readonly showEmailError = computed(
        () => this.form.controls.email.invalid && this.form.controls.email.touched,
    );

    constructor() {
        effect(() => {
            this.form.controls.email.setValue(this.selectedEmail(), { emitEvent: false });
        });
    }

    protected onSubmit(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid) return;

        const { email, password } = this.form.getRawValue();
        const success = this.userService.login(email, password);

        if (success) {
            this.errorMessage.set('');
            this.router.navigateByUrl('/tasks');
        } else {
            this.errorMessage.set('Invalid email or password. Use any registered user email with password 1234.');
        }
    }
}
