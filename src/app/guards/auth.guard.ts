import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { signal } from '@angular/core';

/** Simulated authentication state — always authenticated for demo */
export const isAuthenticated = signal(true);

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);

    if (isAuthenticated()) {
        return true;
    }

    // Redirect to tasks if not authenticated
    return router.parseUrl('/tasks');
};
