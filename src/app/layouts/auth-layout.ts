import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Toolbar, ToolbarWidget } from '@angular/aria/toolbar';
import { ThemeSwitcherComponent } from '../components/theme-switcher/theme-switcher';
import { UserService } from '../services/user.service';
import { slideIn } from '../animations/task.animations';

@Component({
    selector: 'app-auth-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, Toolbar, ToolbarWidget, ThemeSwitcherComponent],
    animations: [slideIn],
    template: `
        <div class="min-h-screen bg-surface-alt">
            <!-- Header with Toolbar -->
            <header class="sticky top-0 z-20 border-b border-border bg-surface">
                <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                    <!-- Logo & Title -->
                    <a routerLink="/tasks" class="flex items-center gap-2">
                        <div
                            class="flex h-8 w-8 items-center justify-center rounded-lg bg-accent"
                        >
                            <svg
                                class="h-5 w-5 text-white"
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
                        <span class="text-lg font-bold text-heading">{{ title() }}</span>
                    </a>

                    <!-- Toolbar actions -->
                    <nav
                        ngToolbar
                        class="flex items-center gap-2"
                        aria-label="Main actions"
                    >
                        <a
                            ngToolbarWidget
                            value="tasks"
                            routerLink="/tasks"
                            routerLinkActive="text-accent-text"
                            [routerLinkActiveOptions]="{ exact: true }"
                            class="rounded-lg px-3 py-1.5 text-sm font-medium text-body transition-colors hover:bg-surface-hover hover:text-heading"
                        >
                            Tasks
                        </a>
                        <a
                            ngToolbarWidget
                            value="add-task"
                            routerLink="/add-task"
                            routerLinkActive="text-accent-text"
                            class="rounded-lg px-3 py-1.5 text-sm font-medium text-body transition-colors hover:bg-surface-hover hover:text-heading"
                        >
                            Add Task
                        </a>
                        <a
                            ngToolbarWidget
                            value="statistics"
                            routerLink="/statistics"
                            routerLinkActive="text-accent-text"
                            class="rounded-lg px-3 py-1.5 text-sm font-medium text-body transition-colors hover:bg-surface-hover hover:text-heading"
                        >
                            Statistics
                        </a>

                        <!-- Separator -->
                        <div
                            class="mx-1 h-5 w-px bg-border"
                            role="separator"
                            aria-orientation="vertical"
                        ></div>

                        <!-- Theme toggle -->
                        <app-theme-switcher />

                        <!-- User menu -->
                        @if (userService.currentUser(); as user) {
                            <div class="flex items-center gap-2">
                                <div
                                    class="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent-text"
                                    [attr.aria-label]="user.name"
                                >
                                    {{ user.avatar }}
                                </div>
                                <span class="hidden text-sm font-medium text-heading sm:inline">
                                    {{ user.name }}
                                </span>
                                <button
                                    ngToolbarWidget
                                    value="logout"
                                    type="button"
                                    (click)="logout()"
                                    class="rounded-lg px-2 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-heading"
                                    aria-label="Sign out"
                                >
                                    <svg
                                        class="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                                            clip-rule="evenodd"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        }
                    </nav>
                </div>
            </header>

            <!-- Main content -->
            <main>
                <router-outlet />
            </main>
        </div>
    `,
})
export default class AuthLayoutComponent {
    protected readonly title = signal('Task Manager');
    protected readonly userService = inject(UserService);
    private readonly router = inject(Router);

    protected logout(): void {
        this.userService.logout();
        this.router.navigateByUrl('/login');
    }
}
