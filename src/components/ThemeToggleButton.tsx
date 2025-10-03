import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ThemeToggleButton = () => {
  const [isLight, setIsLight] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    // Apply sunrise/sunset atmosphere based on theme
    const root = document.documentElement;
    
    if (isLight) {
      // Sunrise atmosphere
      root.style.setProperty('--atmosphere-from', '43 96% 56%'); // Warm sunrise yellow
      root.style.setProperty('--atmosphere-to', '24 100% 50%'); // Sunrise orange
      root.style.setProperty('--atmosphere-glow', '45 93% 47%');
    } else {
      // Sunset/night atmosphere  
      root.style.setProperty('--atmosphere-from', '263 70% 50%'); // Deep purple
      root.style.setProperty('--atmosphere-to', '280 80% 60%'); // Violet
      root.style.setProperty('--atmosphere-glow', '270 75% 55%');
    }
  }, [isLight]);

  const handleToggle = () => {
    setIsRotating(true);
    
    // Create ripple effect
    const button = document.querySelector('[aria-label="Toggle theme"]');
    if (button) {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('div');
      ripple.className = 'theme-ripple';
      ripple.style.left = rect.left + rect.width / 2 + 'px';
      ripple.style.top = rect.top + rect.height / 2 + 'px';
      document.body.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 1000);
    }

    // At 50% of rotation (300ms), swap icon and theme with dramatic transition
    setTimeout(() => {
      setIsLight(!isLight);
      document.documentElement.classList.toggle('light');
      
      // Trigger body atmosphere change
      document.body.style.transition = 'background-color 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 300);

    // Reset rotation state after animation
    setTimeout(() => {
      setIsRotating(false);
    }, 600);
  };

  return (
    <Button
      onClick={handleToggle}
      variant="outline"
      size="icon"
      className={cn(
        "fixed top-6 right-6 z-50 w-14 h-14 rounded-2xl glass-strong hover:scale-110 transition-all duration-300 group overflow-hidden",
        isRotating && "animate-spin-once"
      )}
      aria-label="Toggle theme"
    >
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        isLight ? "from-yellow-400/20 to-orange-500/20" : "from-purple-500/20 to-indigo-600/20"
      )} />
      {isLight ? (
        <Sun className="w-6 h-6 text-primary relative z-10 group-hover:scale-110 transition-transform drop-shadow-glow" />
      ) : (
        <Moon className="w-6 h-6 text-primary relative z-10 group-hover:scale-110 transition-transform drop-shadow-glow" />
      )}
    </Button>
  );
};
