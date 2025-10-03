import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export const FloatingActionButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      size="lg"
      className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 group animate-bounce-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Add new goal"
    >
      <Plus 
        className={`w-7 h-7 transition-transform duration-300 ${
          isHovered ? 'rotate-90 scale-110' : 'rotate-0'
        }`}
      />
    </Button>
  );
};
