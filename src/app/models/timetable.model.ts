export interface TimetableTask {
  id?: string;
  userId: string;
  taskName: string;
  estimatedTime: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  createdAt: Date;
}

export interface ScheduleSlot {
  id?: string;
  taskName: string;
  startTime: string;
  endTime: string;
  duration: number;
  date: Date;
}

export interface DailySchedule {
  id?: string;
  userId: string;
  date: Date;
  slots: ScheduleSlot[];
  createdAt: Date;
}
