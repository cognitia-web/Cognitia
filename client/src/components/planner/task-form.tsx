import { useState } from "react";
import { useQuery, useMutation, queryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SUBJECTS, TASK_INTENSITIES } from "@/lib/constants";
import { z } from "zod";

const taskFormSchema = insertTaskSchema.extend({
  date: z.string().default(() => new Date().toISOString().split('T')[0]),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

export default function TaskForm() {
  const { toast } = useToast();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['/api/tasks', selectedDate],
  });

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors }, 
    reset 
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      date: selectedDate,
      status: "pending",
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      return await apiRequest('POST', '/api/tasks', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({ title: "Success", description: "Task created successfully!" });
      reset();
      setShowCreateTask(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create task", variant: "destructive" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      return await apiRequest('PATCH', `/api/tasks/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({ title: "Success", description: "Task updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update task", variant: "destructive" });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({ title: "Success", description: "Task deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete task", variant: "destructive" });
    },
  });

  const onSubmit = (data: TaskFormData) => {
    createTaskMutation.mutate({ ...data, date: selectedDate });
  };

  const handleCompleteTask = (task: any) => {
    updateTaskMutation.mutate({
      id: task.id,
      updates: {
        status: "completed",
        completedAt: new Date().toISOString(),
      },
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const completedTasks = tasks.filter((task: any) => task.status === "completed");
  const pendingTasks = tasks.filter((task: any) => task.status === "pending");
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header with Date Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Task Management</h2>
          <p className="text-muted-foreground">Organize and track your daily study tasks</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
            data-testid="input-date-selector"
          />
          
          <Dialog open={showCreateTask} onOpenChange={setShowCreateTask}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-task">
                <i className="fas fa-plus mr-2"></i>
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="e.g., Study Chapter 5 - Physics"
                    data-testid="input-task-title"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select onValueChange={(value) => setValue("subject", value)}>
                      <SelectTrigger data-testid="select-task-subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="intensity">Intensity</Label>
                    <Select onValueChange={(value) => setValue("intensity", value)}>
                      <SelectTrigger data-testid="select-task-intensity">
                        <SelectValue placeholder="Select intensity" />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_INTENSITIES.map((intensity) => (
                          <SelectItem key={intensity.value} value={intensity.value}>
                            <span className={intensity.color}>{intensity.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.intensity && (
                      <p className="text-sm text-destructive mt-1">{errors.intensity.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="estimateMin">Estimated Time (minutes)</Label>
                  <Input
                    id="estimateMin"
                    type="number"
                    {...register("estimateMin", { valueAsNumber: true })}
                    placeholder="45"
                    min="1"
                    max="480"
                    data-testid="input-task-estimate"
                  />
                  {errors.estimateMin && (
                    <p className="text-sm text-destructive mt-1">{errors.estimateMin.message}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={createTaskMutation.isPending}
                    data-testid="button-save-task"
                  >
                    {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateTask(false)}
                    data-testid="button-cancel-task"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress Overview */}
      {tasks.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Daily Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {completedTasks.length} of {tasks.length} tasks completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary" data-testid="text-completion-rate">
                  {Math.round(completionRate)}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
            <Progress value={completionRate} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Task Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-clock mr-2 text-orange-600"></i>
              Pending Tasks ({pendingTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending tasks for this date</p>
              </div>
            ) : (
              <div className="space-y-3" data-testid="list-pending-tasks">
                {pendingTasks.map((task: any) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover-lift"
                    data-testid={`pending-task-${task.id}`}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{task.subject}</Badge>
                        <Badge 
                          className={`text-xs ${
                            TASK_INTENSITIES.find(i => i.value === task.intensity)?.color || 'text-muted-foreground'
                          }`}
                          variant="secondary"
                        >
                          {task.intensity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{task.estimateMin}m</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleCompleteTask(task)}
                        disabled={updateTaskMutation.isPending}
                        data-testid={`button-complete-${task.id}`}
                      >
                        <i className="fas fa-check"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={deleteTaskMutation.isPending}
                        data-testid={`button-delete-${task.id}`}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-check-circle mr-2 text-green-600"></i>
              Completed Tasks ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed tasks yet</p>
              </div>
            ) : (
              <div className="space-y-3" data-testid="list-completed-tasks">
                {completedTasks.map((task: any) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                    data-testid={`completed-task-${task.id}`}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-green-800">{task.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{task.subject}</Badge>
                        <Badge 
                          className="text-xs text-green-600"
                          variant="secondary"
                        >
                          {task.intensity}
                        </Badge>
                        <span className="text-xs text-green-600">{task.estimateMin}m</span>
                      </div>
                    </div>
                    {task.pointsAwarded > 0 && (
                      <Badge className="bg-green-100 text-green-700" data-testid={`points-${task.id}`}>
                        +{task.pointsAwarded} pts
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
