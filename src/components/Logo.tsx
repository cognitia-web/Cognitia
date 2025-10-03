import { Brain, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  animated?: boolean;
}

export const Logo = ({ size = 'md', showText = true, animated = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-lg opacity-60 animate-glow" />
        
        {/* Icon container */}
        <div className="relative w-full h-full bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
          <Brain className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
          
          {/* Sparkle effect */}
          {animated && (
            <Sparkles className="w-3 h-3 text-white absolute -top-1 -right-1 animate-pulse" />
          )}
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent`}>
            Cognitia
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-muted-foreground -mt-1">Intelligence Meets Ambition</p>
          )}
        </div>
      )}
    </div>
  );
};
