import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LEVEL_THRESHOLDS } from "@/lib/constants";

interface LevelProgressProps {
  user: any;
}

export default function LevelProgress({ user }: LevelProgressProps) {
  const currentPoints = user?.points || 0;
  const currentLevel = user?.level || "Bronze";
  
  // Find current level config
  const currentLevelConfig = LEVEL_THRESHOLDS.find(level => level.name === currentLevel);
  const currentLevelIndex = LEVEL_THRESHOLDS.findIndex(level => level.name === currentLevel);
  
  // Find next level
  const nextLevel = LEVEL_THRESHOLDS[currentLevelIndex + 1];
  const isMaxLevel = !nextLevel;
  
  // Calculate progress
  const currentThreshold = currentLevelConfig?.threshold || 0;
  const nextThreshold = nextLevel?.threshold || currentThreshold;
  const progressInLevel = currentPoints - currentThreshold;
  const pointsNeededForNextLevel = nextThreshold - currentThreshold;
  const progressPercentage = isMaxLevel ? 100 : Math.min(100, (progressInLevel / pointsNeededForNextLevel) * 100);
  const pointsToNext = isMaxLevel ? 0 : nextThreshold - currentPoints;

  return (
    <Card className="level-gradient text-primary-foreground" data-testid="card-level-progress">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Level Progress</h3>
            <p className="opacity-90">
              {isMaxLevel ? "Maximum level reached!" : `Progress to ${nextLevel?.name}`}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {currentLevelConfig && (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentLevelConfig.bgColor}`}>
                <i className={`${currentLevelConfig.icon} ${currentLevelConfig.iconColor}`}></i>
              </div>
            )}
            <div className="text-right">
              <Badge variant="secondary" className="mb-1" data-testid="badge-current-level">
                {currentLevel}
              </Badge>
              <div className="text-sm opacity-90" data-testid="text-current-points">
                {currentPoints.toLocaleString()} pts
              </div>
            </div>
          </div>
        </div>

        {!isMaxLevel && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>Level Progress</span>
              <span data-testid="text-progress-percentage">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-white/20" 
              data-testid="progress-level"
            />
            
            <div className="flex justify-between items-center text-sm opacity-90">
              <span data-testid="text-progress-points">
                {progressInLevel.toLocaleString()} / {pointsNeededForNextLevel.toLocaleString()} pts
              </span>
              <span data-testid="text-points-to-next">
                {pointsToNext.toLocaleString()} to go
              </span>
            </div>
          </div>
        )}

        {/* Recent Achievement */}
        {user?.streak && user.streak > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center space-x-2">
              <i className="fas fa-fire text-orange-300"></i>
              <span className="text-sm" data-testid="text-streak-display">
                {user.streak}-day streak! Keep it going for bonus points.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
