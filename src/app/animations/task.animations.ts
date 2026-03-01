import {
    animate,
    query,
    stagger,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
    transition(':enter', [style({ opacity: 0 }), animate('200ms ease-out', style({ opacity: 1 }))]),
    transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
]);

export const slideIn = trigger('slideIn', [
    transition(':enter', [
        style({ transform: 'translateX(-20px)', opacity: 0 }),
        animate('250ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
    ]),
    transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(20px)', opacity: 0 })),
    ]),
]);

export const staggerList = trigger('staggerList', [
    transition('* => *', [
        query(
            ':enter',
            [
                style({ opacity: 0, transform: 'translateY(10px)' }),
                stagger('50ms', [
                    animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
                ]),
            ],
            { optional: true },
        ),
    ]),
]);

export const expandCollapse = trigger('expandCollapse', [
    state('collapsed', style({ height: '0', overflow: 'hidden', opacity: 0 })),
    state('expanded', style({ height: '*', overflow: 'visible', opacity: 1 })),
    transition('collapsed <=> expanded', [animate('250ms cubic-bezier(0.4, 0, 0.2, 1)')]),
]);
