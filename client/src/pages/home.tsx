import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DailyQuote from "@/components/common/daily-quote";
import TaskGateModal from "@/components/common/task-gate-modal";
import LevelProgress from "@/components/rewards/level-progress";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import type { Task, RevisionTopic, PointsEvent } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  const [showTaskGate, setShowTaskGate] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const { data: todayTasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks/today'],
  });

  const { data: dueTasks = [] } = useQuery<RevisionTopic[]>({
    queryKey: ['/api/revision/due'],
  });

  const { data: pointsHistory = [] } = useQuery<PointsEvent[]>({
    queryKey: ['/api/points/history'],
  });

  // Check if user needs to add today's task
  useEffect(() => {
    if (!tasksLoading && todayTasks.length === 0) {
      setShowTaskGate(true);
    }
  }, [todayTasks, tasksLoading]);

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-2xl text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.firstName || 'Student'}!</h1>
            <p className="opacity-90">Ready to level up your learning today?</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold" data-testid="text-streak-count">
              Day {user?.streak || 0}
            </div>
            <div className="text-sm opacity-90">Study Streak 🔥</div>
          </div>
        </div>
      </div>

      {/* Daily Quote */}
      <DailyQuote />

      {/* Level Progress */}
      <LevelProgress user={user} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <i className="fas fa-tasks mr-2 text-primary"></i>
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tasks for today yet</p>
                <Button onClick={() => setShowTaskGate(true)} data-testid="button-add-first-task">
                  Add Your First Task
                </Button>
              </div>
            ) : (
              <div className="space-y-3" data-testid="list-today-tasks">
                {todayTasks.map((task: any) => (
                  <div 
                    key={task.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      task.status === 'completed' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-muted/50 border-border'
                    }`}
                    data-testid={`task-item-${task.id}`}
                  >
                    <div className={`w-4 h-4 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' : 'border-2 border-muted'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.status === 'completed' ? 'Completed' : 'In Progress'} • {task.estimateMin} min
                      </p>
                    </div>
                    {task.pointsAwarded > 0 && (
                      <span className="text-xs text-green-600 font-medium">+{task.pointsAwarded} pts</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <i className="fas fa-rocket mr-2 text-accent"></i>
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start hover-lift bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                data-testid="button-generate-flashcards"
              >
                <i className="fas fa-brain mr-3"></i>
                <div className="text-left">
                  <p className="font-medium text-sm">Generate Flashcards</p>
                  <p className="text-xs opacity-75">From notes or PDFs</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover-lift bg-accent/5 border-accent/20 text-accent hover:bg-accent/10"
                data-testid="button-ask-ai-tutor"
              >
                <i className="fas fa-question-circle mr-3"></i>
                <div className="text-left">
                  <p className="font-medium text-sm">Ask AI Tutor</p>
                  <p className="text-xs opacity-75">Get instant answers</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover-lift bg-secondary/5 border-secondary/20 text-secondary hover:bg-secondary/10"
                data-testid="button-plan-schedule"
              >
                <i className="fas fa-calendar mr-3"></i>
                <div className="text-left">
                  <p className="font-medium text-sm">Plan Schedule</p>
                  <p className="text-xs opacity-75">Organize your time</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <i className="fas fa-sync-alt mr-2 text-secondary"></i>
              Next Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dueTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No reviews due today</p>
                <p className="text-xs text-muted-foreground">Great job staying on top of your studies!</p>
              </div>
            ) : (
              <div className="space-y-3" data-testid="list-due-reviews">
                {dueTasks.slice(0, 3).map((topic: any) => (
                  <div 
                    key={topic.id}
                    className={`p-3 rounded-lg border ${
                      topic.nextDate <= today 
                        ? 'border-orange-200 bg-orange-50' 
                        : 'border-border'
                    }`}
                    data-testid={`review-item-${topic.id}`}
                  >
                    <p className="text-sm font-medium">{topic.title}</p>
                    <p className={`text-xs ${
                      topic.nextDate <= today ? 'text-orange-600' : 'text-muted-foreground'
                    }`}>
                      {topic.nextDate <= today ? 'Due today' : `Due in ${Math.ceil((new Date(topic.nextDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <i className="fas fa-history mr-2 text-primary"></i>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pointsHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No activity yet. Complete tasks and study to start earning points!</p>
            </div>
          ) : (
            <div className="space-y-3" data-testid="list-points-history">
              {pointsHistory.slice(0, 5).map((event: any) => (
                <div key={event.id} className="flex justify-between items-center" data-testid={`points-event-${event.id}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.type === 'task_completed' ? 'bg-green-100' :
                      event.type === 'streak_bonus' ? 'bg-orange-100' :
                      event.type === 'deck_mastered' ? 'bg-blue-100' :
                      'bg-purple-100'
                    }`}>
                      <i className={`text-xs ${
                        event.type === 'task_completed' ? 'fas fa-check text-green-600' :
                        event.type === 'streak_bonus' ? 'fas fa-fire text-orange-600' :
                        event.type === 'deck_mastered' ? 'fas fa-brain text-blue-600' :
                        'fas fa-sync-alt text-purple-600'
                      }`}></i>
                    </div>
                    <span className="text-sm">
                      {event.type === 'task_completed' ? 'Completed task' :
                       event.type === 'streak_bonus' ? 'Streak bonus' :
                       event.type === 'deck_mastered' ? 'Mastered deck' :
                       event.type === 'revision_completed' ? 'Completed revision' :
                       event.type}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-green-600" data-testid={`points-amount-${event.id}`}>
                    +{event.amount} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Gate Modal */}
      <TaskGateModal 
        open={showTaskGate} 
        onClose={() => setShowTaskGate(false)}
        onTaskCreated={() => setShowTaskGate(false)}
      />
    </div>
  );
}
