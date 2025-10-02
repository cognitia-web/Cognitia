# Cognitia Premium Features Guide

## Overview
This document provides a comprehensive guide to all the premium, interactive features implemented in the Cognitia Angular application.

---

## 1. Dynamic Immersive Background

**Component:** `AnimatedBackgroundComponent`
**Location:** `src/app/shared/components/animated-background/`

### Features:
- **Gradient Orbs:** 5 floating gradient orbs with independent animation timings
- **Animated Waves:** 3 layered SVG waves with smooth motion
- **Floating Particles:** 30 randomly generated particles floating upward
- **Grid Pattern:** Animated grid overlay that shifts continuously

### Technical Details:
- **Animation Duration:** Orbs (25-35s), Waves (20-30s), Particles (15-35s)
- **Colors:** Uses project gradient palette (blues, purples, pinks)
- **Performance:** GPU-accelerated transforms, respects `prefers-reduced-motion`

---

## 2. Loading Animation

**Component:** `LoadingComponent`
**Location:** `src/app/shared/components/loading/`

### Features:
- **Animated Logo:** Dual rotating rings with SVG stroke animations
- **Pulsing Particles:** 6 particles floating in different directions
- **Letter Animation:** Staggered bounce animation for "Cognitia" text
- **Progress Bar:** Infinite loading bar animation

### Technical Details:
- **Display Duration:** 2 seconds on initial load
- **Animation Timing:** Logo (2s), Particles (2s staggered), Letters (1.2s)
- **Colors:** Gradient from #667eea to #764ba2
- **Z-index:** 9999 (overlay)

---

## 3. Hero Slideshow

**Component:** `HeroSlideshowComponent`
**Location:** `src/app/features/hero-slideshow/`

### Features:
- **Auto-play:** Slides change every 5 seconds
- **Navigation:** Previous/Next buttons with hover effects
- **Dot Indicators:** Active slide indicator with smooth transitions
- **Progress Bar:** Visual timer at bottom showing slide progress
- **CTA Buttons:** Call-to-action with arrow animation on hover

### Slides:
1. **Transform Your Study Habits** - AI-powered learning focus
2. **Master Your Time** - Smart scheduling emphasis
3. **Achieve Your Goals** - Progress tracking highlight

### Technical Details:
- **Transition:** 1000ms cubic-bezier(0.4, 0.0, 0.2, 1)
- **Progress Update:** Every 100ms
- **Overlay:** Linear gradient from #667eea to #764ba2 (85% opacity)
- **Height:** 100vh (full viewport)

### Customization:
```typescript
// Adjust autoplay interval
private readonly autoplayInterval = 5000; // 5 seconds

// Modify slides array in component
slides: Slide[] = [
  {
    id: 1,
    title: 'Your Title',
    subtitle: 'Your Subtitle',
    description: 'Your Description',
    image: 'https://your-image-url.jpg',
    cta: 'Button Text',
    ctaLink: '/your-route'
  }
];
```

---

## 4. Floating Left Navigation

**Component:** `FloatingNavComponent`
**Location:** `src/app/shared/components/floating-nav/`

### Features:
- **Smart Visibility:** Appears after scrolling 200px down
- **Collapsible:** Toggle button to expand/collapse
- **Tooltips:** Hover tooltips in collapsed state
- **Active Link Highlighting:** Visual indicator for current route
- **Smooth Animations:** Slide and fade transitions

### Navigation Items:
- AI Chat
- Tasks
- Timetable
- Flashcards
- Exam Prep
- Profile
- Settings (footer)

### Technical Details:
- **Width:** 280px (expanded), 80px (collapsed)
- **Position:** Fixed left, vertically centered
- **Transition:** 400ms cubic-bezier(0.4, 0.0, 0.2, 1)
- **Background:** rgba(255, 255, 255, 0.95) with 20px blur
- **Visibility Trigger:** window.scrollY > 200px

### Responsive Behavior:
- Hidden on screens < 1024px (mobile/tablet)
- Desktop-only feature for optimal UX

---

## 5. Interactive Goal Cards

**Component:** `GoalCardsComponent`
**Location:** `src/app/features/goal-cards/`

### Features:
- **Hover Animations:** Card lifts and scales on hover
- **Icon Gradients:** Each card has unique gradient color
- **Statistics Display:** Shows relevant metrics per goal
- **Glow Effect:** Radial glow appears on hover
- **Arrow Indicator:** Sliding arrow on card interaction

### Cards:
1. **Smart Task Management** - Purple/pink gradient
2. **AI-Powered Scheduling** - Pink/red gradient
3. **Smart Notes** - Blue/cyan gradient
4. **Interactive Flashcards** - Green/cyan gradient
5. **Progress Tracking** - Pink/yellow gradient
6. **AI Study Assistant** - Cyan/indigo gradient

### Technical Details:
- **Grid:** CSS Grid with auto-fit, minmax(320px, 1fr)
- **Hover Transform:** translateY(-12px) scale(1.02)
- **Animation:** 400ms cubic-bezier(0.4, 0.0, 0.2, 1)
- **Card Shadow:** 0 10px 40px rgba(0, 0, 0, 0.08)

---

## 6. Magic Rotating Button

**Component:** `MagicButtonComponent`
**Location:** `src/app/shared/components/magic-button/`

### Features:
- **360° Rotation:** Smooth rotation animation on click
- **Icon Switch:** Heart outline → Filled heart mid-rotation
- **Background Color Change:** Entire page background transitions
- **Ripple Effect:** Expanding ripple on interaction
- **Particle Burst:** 12 particles fly outward on activation

### States:
1. **Default:** Blue/purple gradient (#667eea → #764ba2)
2. **Liked:** Pink/red gradient (#f093fb → #f5576c)

### Background Transition:
- **Algorithm:** HSL color interpolation
- **Duration:** 1000ms
- **Easing:** Custom cubic easing function
- **Hue Range:** 220° (blue) ↔ 340° (pink)

### Technical Details:
- **Position:** Fixed bottom-right (32px from edges)
- **Size:** 64px × 64px (56px on mobile)
- **Rotation Duration:** 600ms
- **Particle Animation:** 800ms ease-out
- **Z-index:** 1000

---

## 7. Footer Component

**Component:** `FooterComponent`
**Location:** `src/app/shared/components/footer/`

### Features:
- **Gradient Background:** Dark gradient (gray-900 → gray-800)
- **Social Media Links:** 4 platforms with hover effects
- **Link Sections:** Product, Resources, Company
- **Decorative Elements:** 3 gradient orbs for depth
- **Legal Links:** Privacy, Terms, Cookies

### Social Platforms:
- Twitter (#1DA1F2)
- GitHub (#333)
- LinkedIn (#0077B5)
- Instagram (#E4405F)

### Technical Details:
- **Grid Layout:** 2fr (brand) + 3fr (links)
- **Social Hover:** translateY(-4px) with color transition
- **Link Hover:** color change + translateX(4px)
- **Responsive:** Stacks to single column < 968px

---

## 8. Link Hover Effects

**Location:** `src/styles.css`

### Available Effects:

#### Default Hover
```html
<a href="#">Link</a>
```
- Color change to #667eea
- translateY(-1px)

#### Underline Effect
```html
<a class="link-underline" href="#">Link</a>
```
- Animated line grows from left to right
- Gradient underline (#667eea → #764ba2)

#### Glow Effect
```html
<a class="link-glow" href="#">Link</a>
```
- Text shadow glow on hover
- Color change with 20px blue glow

#### Slide Effect
```html
<a class="link-slide" href="#">Link</a>
```
- Underline slides in from left
- 2px gradient line

#### Disable Effects
```html
<a class="no-hover-effect" href="#">Link</a>
```

---

## 9. Animation System

**Location:** `tailwind.config.js` & `src/app/core/animations/`

### Available Animations:

#### Tailwind Classes:
- `animate-fade-in` - Fade in (0.5s)
- `animate-fade-in-up` - Fade in + slide up (0.6s)
- `animate-fade-in-down` - Fade in + slide down (0.6s)
- `animate-slide-in-right` - Slide from right (0.4s)
- `animate-slide-in-left` - Slide from left (0.4s)
- `animate-scale-in` - Scale in (0.3s)
- `animate-bounce-subtle` - Gentle bounce (2s infinite)
- `animate-shimmer` - Shimmer effect (2s infinite)
- `animate-pulse-glow` - Pulsing glow (2s infinite)
- `animate-float` - Float up/down (3s infinite)

#### Angular Animations:
- `fadeIn` - Component fade in
- `fadeInUp` - Component slide up
- `staggerFadeIn` - Staggered children animation
- `cardHover` - Card hover interaction
- `pageTransition` - Route transitions

---

## 10. Responsive Design

### Breakpoints:
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Mobile Optimizations:
- Hero slideshow buttons sized 40×40px
- Magic button sized 56×56px
- Floating nav hidden
- Stats grid: 4 cols → 2 cols → 1 col
- Features grid: 3 cols → 2 cols → 1 col
- Footer grid: 2 cols → 1 col

---

## 11. Performance Optimizations

### Lazy Loading:
- Landing page is lazy-loaded
- Route-based code splitting
- On-demand component loading

### Animations:
- GPU-accelerated transforms (translate, scale, rotate)
- Will-change hints for performance
- Respects `prefers-reduced-motion`

### Images:
- High-quality Unsplash images (1920px width)
- WebP format support
- Lazy loading attributes

---

## 12. Accessibility

### Features:
- **ARIA Labels:** All interactive elements
- **Keyboard Navigation:** Full support
- **Focus Indicators:** Custom ring styles
- **Screen Reader Support:** Semantic HTML
- **Reduced Motion:** Respects user preferences
- **Color Contrast:** WCAG AA compliant

---

## 13. Browser Support

### Modern Browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features Used:
- CSS Grid
- CSS Custom Properties
- Backdrop Filter
- CSS Animations
- ES2020+ JavaScript

---

## 14. Customization Guide

### Colors:
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: { /* Your colors */ },
  accent: { /* Your colors */ }
}
```

### Animation Speeds:
Edit component or `tailwind.config.js`:
```javascript
transitionDuration: {
  '400': '400ms',
  '600': '600ms',
}
```

### Component Visibility:
Toggle in `landing.component.ts`:
```typescript
// Hide floating nav
<app-floating-nav *ngIf="false"></app-floating-nav>

// Hide magic button
<app-magic-button *ngIf="false"></app-magic-button>
```

---

## 15. Development Commands

```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test

# Lint code
ng lint
```

---

## 16. File Structure

```
src/app/
├── core/
│   ├── animations/        # Angular animation definitions
│   └── services/          # Core services (loading, theme)
├── features/
│   ├── hero-slideshow/    # Hero section component
│   └── goal-cards/        # Goal cards component
├── shared/
│   └── components/
│       ├── animated-background/  # Background animations
│       ├── loading/              # Loading screen
│       ├── floating-nav/         # Side navigation
│       ├── magic-button/         # Interactive button
│       └── footer/               # Footer component
└── pages/
    └── landing/           # Main landing page
```

---

## 17. Credits & Inspiration

- **Design System:** Material Design 3.0 principles
- **Color Palette:** Custom gradient system
- **Typography:** System fonts for optimal performance
- **Icons:** Heroicons (MIT License)
- **Images:** Unsplash (Free to use)

---

## Support

For questions or issues, refer to:
- Angular Documentation: https://angular.io/docs
- Tailwind CSS: https://tailwindcss.com/docs
- RxJS: https://rxjs.dev/guide/overview

---

**Built with ❤️ using Angular 17 and Tailwind CSS**
