import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SUBJECTS, TASK_INTENSITIES } from "@/lib/constants";
import { z } from "zod";

const taskFormSchema = insertTaskSchema.extend({
  date: z.string().default(() => new Date().toISOString().split('T')[0]),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskGateModalProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

export default function TaskGateModal({ open, onClose, onTaskCreated }: TaskGateModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      date: new Date().toISOString().split('T')[0],
      status: "pending",
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      return await apiRequest('POST', '/api/tasks', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/today'] });
      toast({ 
        title: "Success", 
        description: "Today's task created! The app is now unlocked." 
      });
      reset();
      onTaskCreated();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: "Failed to create task. Please try again.", 
        variant: "destructive" 
      });
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    await createTaskMutation.mutateAsync(data);
    setIsSubmitting(false);
  };

  const selectedIntensity = watch("intensity");
  const intensityConfig = TASK_INTENSITIES.find(i => i.value === selectedIntensity);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-task-gate">
        <DialogHeader>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-lock text-secondary text-2xl"></i>
            </div>
            <DialogTitle className="text-2xl">Daily Discipline Check</DialogTitle>
            <p className="text-muted-foreground mt-2">Add your first task for today to unlock the app</p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="form-task-gate">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., Study Chapter 5 - Physics"
              className="focus:ring-2 focus:ring-primary focus:border-transparent"
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
              className="focus:ring-2 focus:ring-primary focus:border-transparent"
              data-testid="input-task-estimate"
            />
            {errors.estimateMin && (
              <p className="text-sm text-destructive mt-1">{errors.estimateMin.message}</p>
            )}
          </div>

          {intensityConfig && (
            <div className={`p-3 rounded-lg ${intensityConfig.bgColor} border`}>
              <div className="flex items-center space-x-2">
                <i className="fas fa-info-circle text-sm"></i>
                <span className="text-sm font-medium">
                  {selectedIntensity} intensity task will earn bonus points!
                </span>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full hover-lift glow-effect" 
            disabled={isSubmitting}
            data-testid="button-unlock-app"
          >
            <i className="fas fa-unlock mr-2"></i>
            {isSubmitting ? "Creating..." : "Unlock Today's Journey"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
