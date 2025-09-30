import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, query, orderBy, onSnapshot, where } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { AiService } from '../../services/ai.service';
import { ChatMessage } from '../../models/chat.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage = '';
  loading = false;
  
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private aiService = inject(AiService);
  
  ngOnInit(): void {
    this.loadMessages();
  }
  
  loadMessages(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    
    const messagesRef = collection(this.firestore, 'chats');
    const q = query(
      messagesRef,
      where('userId', '==', user.uid),
      orderBy('timestamp', 'asc')
    );
    
    onSnapshot(q, (snapshot) => {
      this.messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ChatMessage));
    });
  }
  
  async sendMessage(): Promise<void> {
    if (!this.newMessage.trim() || this.loading) return;
    
    const user = this.authService.getCurrentUser();
    if (!user) return;
    
    const messageText = this.newMessage.trim();
    this.newMessage = '';
    this.loading = true;
    
    try {
      // Add user message
      const userMessage: Omit<ChatMessage, 'id'> = {
        userId: user.uid,
        message: messageText,
        timestamp: new Date(),
        isUser: true
      };
      
      await addDoc(collection(this.firestore, 'chats'), userMessage);
      
      // Get AI response
      this.aiService.askQuestion(messageText).subscribe(async (response) => {
        const aiMessage: Omit<ChatMessage, 'id'> = {
          userId: user.uid,
          message: response,
          timestamp: new Date(),
          isUser: false
        };
        
        await addDoc(collection(this.firestore, 'chats'), aiMessage);
        this.loading = false;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      this.loading = false;
    }
  }
  
  getTimestamp(timestamp: any): string {
    if (!timestamp) return '';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleTimeString();
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString();
    }
    return '';
  }
}
