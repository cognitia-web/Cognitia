import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, query, orderBy, onSnapshot, where, deleteDoc, doc } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { TimetableTask, DailySchedule, ScheduleSlot } from '../../models/timetable.model';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.css'
})
export class TimetableComponent implements OnInit {
  tasks: TimetableTask[] = [];
  schedule: DailySchedule | null = null;
  showAddForm = false;
  
  newTask: Partial<TimetableTask> = {
    taskName: '',
    estimatedTime: 30,
    priority: 'medium'
  };
  
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  
  ngOnInit(): void {
    this.loadTasks();
    this.loadSchedule();
  }
  
  loadTasks(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    
    const tasksRef = collection(this.firestore, 'timetables');
    const q = query(
      tasksRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    onSnapshot(q, (snapshot) => {
      this.tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TimetableTask));
    });
  }
  
  loadSchedule(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    
    const schedulesRef = collection(this.firestore, 'schedules');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const q = query(
      schedulesRef,
      where('userId', '==', user.uid),
      where('date', '>=', today)
    );
    
    onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        this.schedule = {
          id: doc.id,
          ...doc.data()
        } as DailySchedule;
      }
    });
  }
  
  async addTask(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user || !this.newTask.taskName?.trim()) return;
    
    try {
      const task: Omit<TimetableTask, 'id'> = {
        userId: user.uid,
        taskName: this.newTask.taskName.trim(),
        estimatedTime: this.newTask.estimatedTime || 30,
        priority: this.newTask.priority || 'medium',
        createdAt: new Date()
      };
      
      await addDoc(collection(this.firestore, 'timetables'), task);
      
      // Reset form
      this.newTask = {
        taskName: '',
        estimatedTime: 30,
        priority: 'medium'
      };
      this.showAddForm = false;
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
  
  async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, 'timetables', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
  
  async generateSchedule(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user || this.tasks.length === 0) return;
    
    try {
      // Sort tasks by priority
      const sortedTasks = [...this.tasks].sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      
      // Generate schedule starting from 9 AM
      const slots: ScheduleSlot[] = [];
      let currentTime = new Date();
      currentTime.setHours(9, 0, 0, 0);
      
      for (const task of sortedTasks) {
        const startTime = new Date(currentTime);
        const endTime = new Date(currentTime.getTime() + task.estimatedTime * 60000);
        
        slots.push({
          taskName: task.taskName,
          startTime: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          endTime: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          duration: task.estimatedTime,
          date: new Date()
        });
        
        // Add 10-minute break between tasks
        currentTime = new Date(endTime.getTime() + 10 * 60000);
      }
      
      const schedule: Omit<DailySchedule, 'id'> = {
        userId: user.uid,
        date: new Date(),
        slots: slots,
        createdAt: new Date()
      };
      
      await addDoc(collection(this.firestore, 'schedules'), schedule);
    } catch (error) {
      console.error('Error generating schedule:', error);
    }
  }
  
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  }
}
