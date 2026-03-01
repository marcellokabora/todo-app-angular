import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const userService = inject(UserService);

    if (userService.isAuthenticated()) {
        return true;
    }

    return router.parseUrl('/login');
};

export const noAuthGuard: CanActivateFn = () => {
    const router = inject(Router);
    const userService = inject(UserService);

    if (!userService.isAuthenticated()) {
        return true;
    }

    return router.parseUrl('/tasks');
};
