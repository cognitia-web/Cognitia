import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  title: string;
  description: string;
  progress: number;
  details: string;
  category: string;
}

export const GoalCard = ({ title, description, progress, details, category }: GoalCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevProgress, setPrevProgress] = useState(progress);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animateProgress) {
            setAnimateProgress(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [animateProgress]);

  // Celebration effect when goal is completed
  useEffect(() => {
    if (progress === 100 && prevProgress < 100) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    setPrevProgress(progress);
  }, [progress, prevProgress]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card
      ref={cardRef}
      className={cn(
        "hover-lift hover-glow cursor-pointer transition-all duration-450 glass group relative overflow-hidden",
        progress === 100 && "ring-2 ring-primary/50"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
    >
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-primary animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
              {category}
            </div>
            <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="leading-relaxed">{description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 hover:bg-primary/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted-foreground font-medium">Progress</span>
            <div className="flex items-center gap-2">
              {progress === 100 && (
                <CheckCircle2 className="w-5 h-5 text-primary animate-bounce-in" />
              )}
              <span className="font-bold text-primary text-base">{progress}%</span>
            </div>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-1000 ease-out relative",
                animateProgress && "animate-progress-fill",
                progress === 100 && "animate-glow"
              )}
              style={{
                width: animateProgress ? `${progress}%` : '0%',
                '--progress-value': `${progress}%`,
              } as React.CSSProperties}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 animate-shimmer opacity-50" />
              
              {/* Celebration particles on completion */}
              {progress === 100 && showCelebration && (
                <div className="absolute inset-0">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-primary rounded-full animate-ping"
                      style={{
                        left: `${(i / 6) * 100}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-450 ease-in-out",
            isExpanded ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          )}
        >
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">{details}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
