import { 
  trigger, 
  state,
  style, 
  animate, 
  transition,
  AnimationTriggerMetadata,
  keyframes
} from '@angular/animations';

/**
 * Magic button animations
 * Features: 360° rotation, icon swap, ripple effect
 */

export const magicRotate: AnimationTriggerMetadata = trigger('magicRotate', [
  state('idle', style({
    transform: 'rotate(0deg) scale(1)'
  })),
  state('rotating', style({
    transform: 'rotate(360deg) scale(1.1)'
  })),
  transition('idle => rotating', [
    animate('800ms cubic-bezier(0.68, -0.55, 0.265, 1.55)')
  ]),
  transition('rotating => idle', [
    animate('400ms ease-out')
  ])
]);

export const iconSwap: AnimationTriggerMetadata = trigger('iconSwap', [
  transition('* => *', [
    animate('200ms', keyframes([
      style({ opacity: 1, transform: 'scale(1)', offset: 0 }),
      style({ opacity: 0, transform: 'scale(0.5)', offset: 0.5 }),
      style({ opacity: 1, transform: 'scale(1)', offset: 1 })
    ]))
  ])
]);

export const rippleEffect: AnimationTriggerMetadata = trigger('rippleEffect', [
  transition('void => *', [
    style({
      transform: 'scale(0)',
      opacity: 0.5
    }),
    animate('600ms ease-out', style({
      transform: 'scale(4)',
      opacity: 0
    }))
  ])
]);

export const buttonPulse: AnimationTriggerMetadata = trigger('buttonPulse', [
  transition('* => *', [
    animate('1500ms', keyframes([
      style({ transform: 'scale(1)', offset: 0 }),
      style({ transform: 'scale(1.05)', offset: 0.5 }),
      style({ transform: 'scale(1)', offset: 1 })
    ]))
  ])
]);

export const buttonHover: AnimationTriggerMetadata = trigger('buttonHover', [
  state('idle', style({
    transform: 'scale(1)',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
  })),
  state('hover', style({
    transform: 'scale(1.05)',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)'
  })),
  transition('idle <=> hover', [
    animate('300ms ease-out')
  ])
]);

export const buttonPress: AnimationTriggerMetadata = trigger('buttonPress', [
  transition('* => pressed', [
    animate('100ms', style({
      transform: 'scale(0.95)'
    }))
  ]),
  transition('pressed => *', [
    animate('200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({
      transform: 'scale(1)'
    }))
  ])
]);

export const shimmer: AnimationTriggerMetadata = trigger('shimmer', [
  transition('* => *', [
    animate('2000ms linear', keyframes([
      style({ backgroundPosition: '-200% center', offset: 0 }),
      style({ backgroundPosition: '200% center', offset: 1 })
    ]))
  ])
]);

export const glowPulse: AnimationTriggerMetadata = trigger('glowPulse', [
  transition('* => *', [
    animate('2000ms ease-in-out', keyframes([
      style({ 
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
        offset: 0 
      }),
      style({ 
        boxShadow: '0 0 40px rgba(99, 102, 241, 0.8), 0 0 60px rgba(139, 92, 246, 0.6)',
        offset: 0.5 
      }),
      style({ 
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
        offset: 1 
      })
    ]))
  ])
]);

export const floatAnimation: AnimationTriggerMetadata = trigger('floatAnimation', [
  transition('* => *', [
    animate('3000ms ease-in-out', keyframes([
      style({ transform: 'translateY(0px)', offset: 0 }),
      style({ transform: 'translateY(-10px)', offset: 0.5 }),
      style({ transform: 'translateY(0px)', offset: 1 })
    ]))
  ])
]);

export const morphShape: AnimationTriggerMetadata = trigger('morphShape', [
  state('circle', style({
    borderRadius: '50%'
  })),
  state('square', style({
    borderRadius: '8px'
  })),
  state('rounded', style({
    borderRadius: '24px'
  })),
  transition('* <=> *', [
    animate('600ms cubic-bezier(0.4, 0.0, 0.2, 1)')
  ])
]);

/**
 * Background color transition animation
 * Used for theme switching with sunrise effect
 */
export const backgroundTransition: AnimationTriggerMetadata = trigger('backgroundTransition', [
  transition('* => *', [
    animate('2000ms ease', keyframes([
      style({ opacity: 0, offset: 0 }),
      style({ opacity: 0.3, offset: 0.3 }),
      style({ opacity: 0.7, offset: 0.7 }),
      style({ opacity: 1, offset: 1 })
    ]))
  ])
]);

/**
 * Success checkmark animation
 */
export const successCheck: AnimationTriggerMetadata = trigger('successCheck', [
  transition('void => *', [
    style({ 
      strokeDashoffset: 100,
      opacity: 0 
    }),
    animate('600ms ease-out', style({ 
      strokeDashoffset: 0,
      opacity: 1 
    }))
  ])
]);

/**
 * Loading spinner animation
 */
export const spinnerRotate: AnimationTriggerMetadata = trigger('spinnerRotate', [
  transition('* => *', [
    animate('1000ms linear', keyframes([
      style({ transform: 'rotate(0deg)', offset: 0 }),
      style({ transform: 'rotate(360deg)', offset: 1 })
    ]))
  ])
]);

/**
 * Export all button animations
 */
export const buttonAnimations = [
  magicRotate,
  iconSwap,
  rippleEffect,
  buttonPulse,
  buttonHover,
  buttonPress,
  shimmer,
  glowPulse,
  floatAnimation,
  morphShape,
  backgroundTransition,
  successCheck,
  spinnerRotate
];
