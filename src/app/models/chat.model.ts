export interface ChatMessage {
  id?: string;
  userId: string;
  message: string;
  response?: string;
  timestamp: Date;
  isUser: boolean;
}
