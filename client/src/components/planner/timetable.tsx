import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TASK_INTENSITIES } from "@/lib/constants";
import type { Task } from "@shared/schema";

interface TimeSlot {
  time: string;
  task?: any;
  available: boolean;
}

export default function Timetable() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['/api/tasks', selectedDate],
  });

  // Generate time slots
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const start = new Date(`${selectedDate}T${startTime}`);
    const end = new Date(`${selectedDate}T${endTime}`);
    
    let current = new Date(start);
    while (current < end) {
      const timeString = current.toTimeString().slice(0, 5);
      slots.push({
        time: timeString,
        available: true,
      });
      current.setMinutes(current.getMinutes() + 30); // 30-minute slots
    }
    
    return slots;
  };

  // Auto-schedule tasks based on intensity and available time
  const scheduleTasksAutomatically = () => {
    const pendingTasks = tasks.filter((task: Task) => task.status === "pending");
    const timeSlots = generateTimeSlots();
    
    // Sort tasks by intensity (High > Medium > Low)
    const sortedTasks = [...pendingTasks].sort((a, b) => {
      const intensityOrder = { High: 3, Medium: 2, Low: 1 };
      return intensityOrder[b.intensity as keyof typeof intensityOrder] - 
             intensityOrder[a.intensity as keyof typeof intensityOrder];
    });

    let currentSlotIndex = 0;
    const scheduledSlots = [...timeSlots];

    sortedTasks.forEach((task) => {
      const slotsNeeded = Math.ceil(task.estimateMin / 30);
      
      if (currentSlotIndex + slotsNeeded <= scheduledSlots.length) {
        // Assign task to the required number of slots
        for (let i = 0; i < slotsNeeded; i++) {
          if (currentSlotIndex + i < scheduledSlots.length) {
            scheduledSlots[currentSlotIndex + i] = {
              ...scheduledSlots[currentSlotIndex + i],
              task,
              available: false,
            };
          }
        }
        currentSlotIndex += slotsNeeded;
      }
    });

    return scheduledSlots;
  };

  const scheduledSlots = scheduleTasksAutomatically();
  const pendingTasks = tasks.filter((task: any) => task.status === "pending");
  const totalEstimatedTime = pendingTasks.reduce((total: number, task: any) => total + task.estimateMin, 0);

  const getIntensityConfig = (intensity: string) => {
    return TASK_INTENSITIES.find(i => i.value === intensity) || TASK_INTENSITIES[1];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Study Timetable</h2>
          <p className="text-muted-foreground">Auto-generated schedule based on task intensity and time</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
            data-testid="input-timetable-date"
          />
        </div>
      </div>

      {/* Time Range Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-clock mr-2 text-primary"></i>
            Schedule Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                data-testid="input-start-time"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Time</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                data-testid="input-end-time"
              />
            </div>
            <div>
              <Button className="w-full" data-testid="button-regenerate-schedule">
                <i className="fas fa-refresh mr-2"></i>
                Regenerate Schedule
              </Button>
            </div>
          </div>

          {/* Schedule Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary" data-testid="text-total-tasks">
                {pendingTasks.length}
              </div>
              <div className="text-sm text-muted-foreground">Pending Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary" data-testid="text-total-time">
                {Math.floor(totalEstimatedTime / 60)}h {totalEstimatedTime % 60}m
              </div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent" data-testid="text-available-slots">
                {scheduledSlots.filter(slot => slot.available).length}
              </div>
              <div className="text-sm text-muted-foreground">Free Slots</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Schedule Grid */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-calendar-alt mr-2 text-secondary"></i>
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledSlots.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No time slots available. Adjust your start and end times.</p>
                </div>
              ) : (
                <div className="space-y-2" data-testid="timetable-slots">
                  {scheduledSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-lg border transition-all hover-lift ${
                        slot.task 
                          ? `${getIntensityConfig(slot.task.intensity).bgColor} border-l-4 border-l-${getIntensityConfig(slot.task.intensity).color.replace('text-', '')}`
                          : 'bg-muted/30 border-dashed'
                      }`}
                      data-testid={`time-slot-${slot.time}`}
                    >
                      <div className="w-16 text-sm font-medium">{slot.time}</div>
                      
                      {slot.task ? (
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{slot.task.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">{slot.task.subject}</Badge>
                              <Badge 
                                className={`text-xs ${getIntensityConfig(slot.task.intensity).color}`}
                                variant="secondary"
                              >
                                {slot.task.intensity}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {slot.task.estimateMin}m
                            </span>
                            <Button size="sm" variant="outline" data-testid={`button-edit-slot-${index}`}>
                              <i className="fas fa-edit text-xs"></i>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">Free Time</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Unscheduled Tasks */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <i className="fas fa-list mr-2 text-orange-600"></i>
                Unscheduled Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">All tasks are scheduled!</p>
                </div>
              ) : (
                <div className="space-y-3" data-testid="unscheduled-tasks">
                  {pendingTasks.map((task: any) => {
                    const isScheduled = scheduledSlots.some(slot => slot.task?.id === task.id);
                    if (isScheduled) return null;

                    return (
                      <div 
                        key={task.id}
                        className="p-3 border rounded-lg hover-lift cursor-grab"
                        draggable
                        data-testid={`unscheduled-task-${task.id}`}
                      >
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <div className="flex items-center space-x-1 mt-1">
                          <Badge variant="outline" className="text-xs">{task.subject}</Badge>
                          <Badge 
                            className={`text-xs ${getIntensityConfig(task.intensity).color}`}
                            variant="secondary"
                          >
                            {task.intensity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{task.estimateMin}m</p>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <i className="fas fa-info-circle mr-1"></i>
                  Drag tasks to time slots to manually schedule them.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
