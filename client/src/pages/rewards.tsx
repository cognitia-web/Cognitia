import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LevelProgress from "@/components/rewards/level-progress";
import PointsHistory from "@/components/rewards/points-history";
import { useAuth } from "@/hooks/useAuth";
import { LEVEL_THRESHOLDS } from "@/lib/constants";

export default function Rewards() {
  const { user } = useAuth();
  
  const { data: pointsHistory = [] } = useQuery({
    queryKey: ['/api/points/history'],
  });

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rewards & Progress</h1>
        <p className="text-muted-foreground">Track your learning journey from Bronze to Energon</p>
      </div>

      {/* Current Level Overview */}
      <LevelProgress user={user} />

      {/* Level Ladder */}
      <Card>
        <CardHeader>
          <CardTitle>Rewards Ladder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {LEVEL_THRESHOLDS.map((level, index) => {
              const isCurrentLevel = user?.level === level.name;
              const isUnlocked = (user?.points || 0) >= level.threshold;
              
              return (
                <Card 
                  key={level.name}
                  className={`text-center hover-lift transition-all ${
                    isCurrentLevel ? 'glow-effect border-2 border-primary' :
                    isUnlocked ? 'bg-green-50 border-green-200' :
                    'opacity-60'
                  }`}
                  data-testid={`level-card-${level.name.toLowerCase()}`}
                >
                  <CardContent className="p-4">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${level.bgColor}`}>
                      <i className={`${level.icon} ${level.iconColor}`}></i>
                    </div>
                    <h4 className={`font-bold ${level.textColor}`}>{level.name}</h4>
                    <p className={`text-xs ${level.subTextColor}`}>{level.threshold} pts</p>
                    {isCurrentLevel && (
                      <Badge variant="default" className="mt-2 text-xs">Current</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Points History */}
      <PointsHistory events={pointsHistory} />

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2" data-testid="text-total-points">
              {user?.points || 0}
            </div>
            <p className="text-muted-foreground">Total Points</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2" data-testid="text-current-streak">
              {user?.streak || 0}
            </div>
            <p className="text-muted-foreground">Day Streak 🔥</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2" data-testid="text-current-level">
              {user?.level || "Bronze"}
            </div>
            <p className="text-muted-foreground">Current Level</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
