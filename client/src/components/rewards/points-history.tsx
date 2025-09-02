import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PointsHistoryProps {
  events: any[];
}

const getEventIcon = (type: string): string => {
  switch (type) {
    case 'task_completed':
      return 'fas fa-check';
    case 'task_created':
      return 'fas fa-plus';
    case 'streak_bonus':
      return 'fas fa-fire';
    case 'deck_mastered':
      return 'fas fa-brain';
    case 'revision_completed':
      return 'fas fa-sync-alt';
    case 'flashcard_correct':
      return 'fas fa-lightbulb';
    default:
      return 'fas fa-star';
  }
};

const getEventColor = (type: string): string => {
  switch (type) {
    case 'task_completed':
      return 'bg-green-100 text-green-600';
    case 'task_created':
      return 'bg-blue-100 text-blue-600';
    case 'streak_bonus':
      return 'bg-orange-100 text-orange-600';
    case 'deck_mastered':
      return 'bg-purple-100 text-purple-600';
    case 'revision_completed':
      return 'bg-indigo-100 text-indigo-600';
    case 'flashcard_correct':
      return 'bg-yellow-100 text-yellow-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getEventDescription = (type: string): string => {
  switch (type) {
    case 'task_completed':
      return 'Completed task';
    case 'task_created':
      return 'Created task';
    case 'streak_bonus':
      return 'Study streak bonus';
    case 'deck_mastered':
      return 'Mastered flashcard deck';
    case 'revision_completed':
      return 'Completed revision session';
    case 'flashcard_correct':
      return 'Correct flashcard answer';
    default:
      return 'Points earned';
  }
};

export default function PointsHistory({ events }: PointsHistoryProps) {
  const totalPoints = events.reduce((sum, event) => sum + event.amount, 0);
  const recentEvents = events.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-history mr-2 text-primary"></i>
            Points History
          </div>
          <Badge variant="outline" data-testid="badge-total-points">
            {totalPoints.toLocaleString()} total pts
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-star text-muted-foreground text-2xl"></i>
            </div>
            <p className="text-muted-foreground">No points earned yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Complete tasks and study to start earning points!
            </p>
          </div>
        ) : (
          <div className="space-y-3" data-testid="list-points-events">
            {recentEvents.map((event) => (
              <div 
                key={event.id} 
                className="flex items-center justify-between p-3 rounded-lg border hover-lift"
                data-testid={`points-event-${event.id}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}>
                    <i className={`${getEventIcon(event.type)} text-sm`}></i>
                  </div>
                  <div>
                    <p className="font-medium text-sm" data-testid={`event-description-${event.id}`}>
                      {getEventDescription(event.type)}
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid={`event-date-${event.id}`}>
                      {new Date(event.createdAt).toLocaleDateString()} at{' '}
                      {new Date(event.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span 
                    className="font-semibold text-green-600"
                    data-testid={`event-points-${event.id}`}
                  >
                    +{event.amount}
                  </span>
                  {event.type === 'streak_bonus' && event.meta?.streakDay && (
                    <p className="text-xs text-muted-foreground">
                      Day {event.meta.streakDay}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {events.length > 10 && (
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing recent 10 events • {events.length - 10} more in history
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
