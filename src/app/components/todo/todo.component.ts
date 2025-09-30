import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, query, orderBy, onSnapshot, where, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  showAddForm = false;
  
  newTodo: Partial<Todo> = {
    title: '',
    description: '',
    completed: false,
    deadline: new Date()
  };
  
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  
  ngOnInit(): void {
    this.loadTodos();
  }
  
  loadTodos(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    
    const todosRef = collection(this.firestore, 'todos');
    const q = query(
      todosRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    onSnapshot(q, (snapshot) => {
      this.todos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Todo));
    });
  }
  
  async addTodo(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user || !this.newTodo.title?.trim()) return;
    
    try {
      const todo: Omit<Todo, 'id'> = {
        userId: user.uid,
        title: this.newTodo.title.trim(),
        description: this.newTodo.description?.trim() || '',
        completed: false,
        deadline: new Date(this.newTodo.deadline!),
        createdAt: new Date()
      };
      
      await addDoc(collection(this.firestore, 'todos'), todo);
      
      // Reset form
      this.newTodo = {
        title: '',
        description: '',
        completed: false,
        deadline: new Date()
      };
      this.showAddForm = false;
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }
  
  async toggleComplete(todo: Todo): Promise<void> {
    if (!todo.id) return;
    
    try {
      const todoRef = doc(this.firestore, 'todos', todo.id);
      await updateDoc(todoRef, { completed: !todo.completed });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }
  
  async deleteTodo(todoId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, 'todos', todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }
  
  isOverdue(deadline: Date): boolean {
    return new Date(deadline) < new Date() && !this.todos.find(t => t.deadline === deadline)?.completed;
  }
}
