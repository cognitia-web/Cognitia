# Cognitia - Premium UI/UX Design Guide

## 🎨 Design Philosophy

Cognitia's design language combines **modern minimalism** with **delightful micro-interactions**, creating an experience that feels both **professional and magical**. Every element is crafted to enhance usability while providing visual satisfaction.

---

## 🌈 Color Palette

### Primary Colors
```css
Primary Blue:
- 50:  #f0f9ff  (Lightest - backgrounds)
- 100: #e0f2fe
- 200: #bae6fd
- 300: #7dd3fc
- 400: #38bdf8
- 500: #0ea5e9  (Base - main actions)
- 600: #0284c7  (Buttons, links)
- 700: #0369a1
- 800: #075985
- 900: #0c4a6e  (Darkest - text)
- 950: #082f49
```

### Accent Colors (Purple/Magenta)
```css
Accent:
- 50:  #fdf4ff
- 500: #d946ef  (Highlights, gradients)
- 600: #c026d3
- 900: #701a75
```

### Success Colors (Green)
```css
Success:
- 50:  #f0fdf4
- 500: #22c55e  (Completed states)
- 600: #16a34a
```

### Gradient Combinations
```css
Premium: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Ocean:   linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)
Sunset:  linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)
Forest:  linear-gradient(135deg, #10b981 0%, #059669 100%)
```

---

## 🎭 Design Patterns

### Glassmorphism
Premium frosted glass effect with backdrop blur:
```css
.card-glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}
```

### Neumorphism (Subtle)
Soft shadows for depth:
```css
box-shadow: 
  0 10px 40px rgba(0, 0, 0, 0.1),  /* Outer shadow */
  inset 0 0 20px rgba(255, 255, 255, 0.1); /* Inner glow */
```

### Gradient Overlays
Used for buttons, cards, and highlights:
```css
background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
```

---

## ✨ Micro-Interactions

### Button Hover Effects
```css
/* Scale + Shadow */
transform: scale(1.05);
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

/* Shimmer Effect */
.btn-primary::before {
  content: '';
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255,255,255,0.2), 
    transparent);
  animation: shimmer 2s infinite;
}
```

### Input Focus
```css
/* Smooth scale + glow */
transform: scale(1.02);
box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.2);
border-color: #0ea5e9;
```

### Card Hover
```css
/* Lift effect */
transform: scale(1.01);
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
```

### Icon Animations
```css
/* Rotate on hover */
transform: rotate(12deg) scale(1.1);

/* Bounce */
animation: bounceSubtle 2s infinite;
```

---

## 🎬 Macro Transitions

### Page Transitions
```css
/* Fade in from bottom */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Message Animations
```css
/* Chat messages slide in */
.message-bubble {
  animation: fadeInUp 0.6s ease-out;
}
```

### Card Flip (Flashcards)
```css
/* 3D flip with perspective */
.flip-card {
  perspective: 1500px;
}

.flip-card-inner {
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.flipped .flip-card-inner {
  transform: rotateY(180deg);
}
```

### Loading States
```css
/* Shimmer skeleton */
.skeleton {
  background: linear-gradient(90deg,
    #e5e7eb 0%,
    #f3f4f6 50%,
    #e5e7eb 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
```

---

## 🎯 Component Styles

### Premium Buttons
```css
.btn-primary {
  /* Gradient background */
  background: linear-gradient(to right, #0284c7, #0369a1);
  
  /* Shadow depth */
  box-shadow: 0 10px 25px rgba(2, 132, 199, 0.3);
  
  /* Smooth transitions */
  transition: all 0.3s ease-out;
  
  /* Hover state */
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 35px rgba(2, 132, 199, 0.4);
  }
  
  /* Shimmer effect */
  &::before {
    background: linear-gradient(90deg,
      transparent,
      rgba(255,255,255,0.2),
      transparent);
  }
}
```

### Glass Cards
```css
.card {
  /* Frosted glass */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  
  /* Subtle border */
  border: 1px solid rgba(255, 255, 255, 0.5);
  
  /* Premium shadow */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  
  /* Rounded corners */
  border-radius: 1rem;
  
  /* Hover lift */
  &:hover {
    transform: scale(1.01);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }
}
```

### Input Fields
```css
.input-field {
  /* Glass background */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  
  /* Subtle border */
  border: 2px solid rgba(0, 0, 0, 0.1);
  
  /* Focus state */
  &:focus {
    transform: scale(1.02);
    border-color: #0ea5e9;
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.2);
  }
}
```

### Message Bubbles
```css
/* User messages */
.message-user {
  background: linear-gradient(to right, #0284c7, #0369a1);
  color: white;
  border-radius: 1rem 1rem 0.25rem 1rem;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}

/* AI messages */
.message-ai {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem 1rem 1rem 0.25rem;
}
```

---

## 🎨 Navigation Design

### Fixed Header
```css
nav {
  /* Glass effect */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  
  /* Subtle shadow */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  
  /* Fixed position */
  position: fixed;
  top: 0;
  z-index: 40;
}
```

### Nav Links
```css
.nav-link {
  /* Smooth transitions */
  transition: all 0.3s ease;
  
  /* Hover state */
  &:hover {
    transform: scale(1.05);
    background: linear-gradient(to right,
      rgba(14, 165, 233, 0.1),
      rgba(217, 70, 239, 0.1));
  }
  
  /* Active state */
  &.nav-active {
    background: linear-gradient(to right, #0284c7, #c026d3);
    color: white;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
  }
}
```

### Logo Animation
```css
.logo {
  /* Gradient background */
  background: linear-gradient(to bottom right, #0284c7, #c026d3);
  
  /* Hover effects */
  &:hover {
    transform: scale(1.1) rotate(3deg);
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
  }
}
```

---

## 🌊 Animations Library

### Fade Animations
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Slide Animations
```css
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

### Scale Animations
```css
@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

### Shimmer Effect
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

### Floating Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

### Pulse Glow
```css
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(14, 165, 233, 0.8);
  }
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 767px) {
  /* Stack layouts */
  /* Larger touch targets */
  /* Simplified animations */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 2-column grids */
  /* Medium spacing */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full layouts */
  /* All animations */
  /* Hover effects */
}
```

### Mobile Optimizations
- Larger touch targets (min 44x44px)
- Simplified animations (reduce motion)
- Hamburger menu with slide-in
- Bottom navigation option
- Swipe gestures

---

## ♿ Accessibility

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  /* Increase contrast ratios */
  /* Thicker borders */
  /* Stronger colors */
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus States
```css
:focus-visible {
  outline: none;
  ring: 4px solid rgba(14, 165, 233, 0.5);
  ring-offset: 2px;
}
```

### Color Contrast
- Text: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: 3:1 ratio

---

## 🎪 Special Effects

### Floating Action Button
```css
.fab {
  /* Gradient background */
  background: linear-gradient(to right, #0284c7, #c026d3);
  
  /* Floating animation */
  animation: float 3s ease-in-out infinite;
  
  /* Hover effects */
  &:hover {
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 0 30px rgba(14, 165, 233, 0.6);
  }
}
```

### Tooltip
```css
.tooltip {
  /* Hidden by default */
  opacity: 0;
  visibility: hidden;
  transform: scale(0.95);
  
  /* Smooth reveal */
  transition: all 0.3s ease;
  
  /* Visible state */
  &.tooltip-visible {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }
}
```

### Progress Bar
```css
.progress-fill {
  background: linear-gradient(to right, #0284c7, #c026d3);
  transition: width 0.5s ease-out;
  border-radius: 9999px;
}
```

---

## 🎨 Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
             'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
             sans-serif;
```

### Font Smoothing
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### Hierarchy
- **Headings**: Bold, gradient text
- **Body**: Regular weight, high contrast
- **Captions**: Smaller, muted colors

---

## 🌟 Best Practices

### Performance
- Use `will-change` for animated elements
- Prefer `transform` and `opacity` for animations
- Debounce scroll/resize events
- Lazy load images and heavy components

### Consistency
- Use design tokens (CSS variables)
- Follow 8px grid system
- Maintain consistent spacing
- Reuse component patterns

### Delight
- Add subtle animations
- Provide visual feedback
- Use micro-interactions
- Create smooth transitions

---

## 🚀 Implementation Tips

### Angular + Tailwind
1. Use Tailwind's `@apply` directive for reusable styles
2. Create custom Tailwind plugins for complex patterns
3. Use Angular animations for route transitions
4. Leverage CSS custom properties for theming

### Dark Mode
```css
/* Automatic dark mode */
@media (prefers-color-scheme: dark) {
  /* Dark theme styles */
}

/* Manual toggle */
.dark {
  /* Dark theme styles */
}
```

---

## 📊 Design Metrics

### Animation Timing
- **Micro**: 200-300ms (hover, focus)
- **Macro**: 400-600ms (page transitions)
- **Loading**: 1-2s (skeletons, spinners)

### Spacing Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

### Shadow Depths
- **sm**: Subtle elevation
- **md**: Standard cards
- **lg**: Modals, dropdowns
- **xl**: Floating elements

---

**Design System Version**: 1.0.0  
**Last Updated**: 2025-09-30  
**Status**: ✅ Production Ready
