import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const started = performance.now();
    return next(req).pipe(
        tap({
            next: () => {
                const elapsed = Math.round(performance.now() - started);
                console.log(`[HTTP] ${req.method} ${req.urlWithParams} — ${elapsed}ms`);
            },
            error: (err) => {
                const elapsed = Math.round(performance.now() - started);
                console.error(`[HTTP] ${req.method} ${req.urlWithParams} — FAILED (${elapsed}ms)`, err);
            },
        }),
    );
};
