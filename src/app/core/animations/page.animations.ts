import { 
  trigger, 
  transition, 
  style, 
  animate, 
  query, 
  stagger,
  AnimationTriggerMetadata 
} from '@angular/animations';

/**
 * Premium page transition animations
 * Timing: 600ms cubic-bezier for smooth, professional feel
 */

export const fadeIn: AnimationTriggerMetadata = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('600ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1 }))
  ])
]);

export const fadeInUp: AnimationTriggerMetadata = trigger('fadeInUp', [
  transition(':enter', [
    style({ 
      opacity: 0, 
      transform: 'translateY(40px)' 
    }),
    animate(
      '600ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
      style({ 
        opacity: 1, 
        transform: 'translateY(0)' 
      })
    )
  ])
]);

export const fadeInDown: AnimationTriggerMetadata = trigger('fadeInDown', [
  transition(':enter', [
    style({ 
      opacity: 0, 
      transform: 'translateY(-40px)' 
    }),
    animate(
      '600ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
      style({ 
        opacity: 1, 
        transform: 'translateY(0)' 
      })
    )
  ])
]);

export const slideInLeft: AnimationTriggerMetadata = trigger('slideInLeft', [
  transition(':enter', [
    style({ 
      opacity: 0, 
      transform: 'translateX(-100%)' 
    }),
    animate(
      '600ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
      style({ 
        opacity: 1, 
        transform: 'translateX(0)' 
      })
    )
  ])
]);

export const slideInRight: AnimationTriggerMetadata = trigger('slideInRight', [
  transition(':enter', [
    style({ 
      opacity: 0, 
      transform: 'translateX(100%)' 
    }),
    animate(
      '600ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
      style({ 
        opacity: 1, 
        transform: 'translateX(0)' 
      })
    )
  ])
]);

export const scaleIn: AnimationTriggerMetadata = trigger('scaleIn', [
  transition(':enter', [
    style({ 
      opacity: 0, 
      transform: 'scale(0.8)' 
    }),
    animate(
      '600ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
      style({ 
        opacity: 1, 
        transform: 'scale(1)' 
      })
    )
  ])
]);

export const staggerFadeIn: AnimationTriggerMetadata = trigger('staggerFadeIn', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [
        animate(
          '400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ], { optional: true })
  ])
]);

export const routeTransition: AnimationTriggerMetadata = trigger('routeTransition', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        opacity: 0
      })
    ], { optional: true }),
    
    query(':enter', [
      animate(
        '600ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        style({ opacity: 1 })
      )
    ], { optional: true })
  ])
]);

export const expandCollapse: AnimationTriggerMetadata = trigger('expandCollapse', [
  transition(':enter', [
    style({ 
      height: 0, 
      opacity: 0, 
      overflow: 'hidden' 
    }),
    animate(
      '400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      style({ 
        height: '*', 
        opacity: 1 
      })
    )
  ]),
  transition(':leave', [
    style({ 
      height: '*', 
      opacity: 1, 
      overflow: 'hidden' 
    }),
    animate(
      '400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      style({ 
        height: 0, 
        opacity: 0 
      })
    )
  ])
]);

export const pulseGlow: AnimationTriggerMetadata = trigger('pulseGlow', [
  transition('* => *', [
    animate(
      '2000ms ease-in-out',
      style({ 
        boxShadow: '0 0 40px rgba(99, 102, 241, 0.8)' 
      })
    ),
    animate(
      '2000ms ease-in-out',
      style({ 
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' 
      })
    )
  ])
]);

/**
 * Loading animation states
 */
export const loadingAnimation: AnimationTriggerMetadata = trigger('loadingAnimation', [
  transition('void => *', [
    style({ 
      opacity: 0,
      transform: 'scale(0.8) rotate(-10deg)'
    }),
    animate(
      '800ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      style({ 
        opacity: 1,
        transform: 'scale(1) rotate(0deg)'
      })
    )
  ]),
  transition('* => void', [
    animate(
      '600ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      style({ 
        opacity: 0,
        transform: 'scale(0.8)'
      })
    )
  ])
]);

/**
 * Card hover animation
 */
export const cardHover: AnimationTriggerMetadata = trigger('cardHover', [
  transition('idle => hover', [
    animate(
      '400ms ease-in-out',
      style({ 
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
      })
    )
  ]),
  transition('hover => idle', [
    animate(
      '400ms ease-in-out',
      style({ 
        transform: 'translateY(0) scale(1)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
      })
    )
  ])
]);

/**
 * Export all animations as array for easy import
 */
export const pageAnimations = [
  fadeIn,
  fadeInUp,
  fadeInDown,
  slideInLeft,
  slideInRight,
  scaleIn,
  staggerFadeIn,
  routeTransition,
  expandCollapse,
  pulseGlow,
  loadingAnimation,
  cardHover
];
