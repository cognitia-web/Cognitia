# Cognitia - Features Documentation

## 📚 Complete Feature Guide

---

## 🔐 1. Authentication System

### Features
- **Email/Password Registration**
  - Minimum 6 character password requirement
  - Password confirmation validation
  - Automatic login after signup
  
- **Secure Login**
  - Email/password authentication via Firebase
  - Session persistence
  - Error handling with user-friendly messages
  
- **User Profile**
  - Display user email and ID
  - Email verification status
  - Sign out functionality

### Technical Implementation
- **Service**: `AuthService` (`src/app/services/auth.service.ts`)
- **Components**: 
  - `LoginComponent` - Login form with validation
  - `SignupComponent` - Registration with password confirmation
  - `ProfileComponent` - User account information
- **Guard**: `authGuard` - Protects all feature routes
- **Firebase**: Authentication with Email/Password provider

### User Flow
1. New users sign up with email/password
2. Existing users log in
3. Authenticated users access all features
4. Users can view profile and logout

---

## 💬 2. AI Chat Interface

### Features
- **ChatGPT-Style Interface**
  - Left-aligned AI responses
  - Right-aligned user messages
  - Timestamp for each message
  
- **Real-Time Messaging**
  - Messages stored in Firestore
  - Instant updates with Firestore listeners
  - Message history persists across sessions
  
- **AI Integration**
  - Placeholder AI service ready for API integration
  - Mock responses for testing
  - Loading states during processing

### Technical Implementation
- **Component**: `ChatComponent` (`src/app/components/chat/chat.component.ts`)
- **Service**: `AiService` (`src/app/services/ai.service.ts`)
- **Firestore Collection**: `chats/{userId}`
- **Model**: `ChatMessage` interface

### Data Structure
```typescript
{
  userId: string,
  message: string,
  timestamp: Date,
  isUser: boolean
}
```

### Customization
Replace mock AI in `ai.service.ts`:
```typescript
askQuestion(question: string): Observable<string> {
  return this.http.post<{answer: string}>(this.apiUrl, { question })
    .pipe(map(response => response.answer));
}
```

---

## ✅ 3. To-Do List Manager

### Features
- **Task Management**
  - Create tasks with title and description
  - Set deadlines with date/time picker
  - Mark tasks as complete/incomplete
  - Delete tasks
  
- **Visual Indicators**
  - Overdue tasks highlighted in red
  - Completed tasks with checkmark
  - Strikethrough for completed items
  
- **Organization**
  - Tasks sorted by creation date (newest first)
  - Deadline display with calendar icon
  - Completion status tracking

### Technical Implementation
- **Component**: `TodoComponent` (`src/app/components/todo/todo.component.ts`)
- **Firestore Collection**: `todos/{userId}`
- **Model**: `Todo` interface

### Data Structure
```typescript
{
  userId: string,
  title: string,
  description: string,
  completed: boolean,
  deadline: Date,
  createdAt: Date
}
```

### Features in Detail
- **Add Task**: Form with title, description, deadline
- **Toggle Complete**: Checkbox to mark done
- **Delete**: Remove task with confirmation
- **Overdue Detection**: Automatic red highlighting

---

## 📅 4. Smart Timetable Generator

### Features
- **Task Input**
  - Task name
  - Estimated time (in minutes)
  - Priority level (low/medium/high)
  
- **Auto-Schedule Generation**
  - Priority-based task ordering
  - Automatic time slot calculation
  - 10-minute breaks between tasks
  - Starts from 9:00 AM by default
  
- **Visual Schedule**
  - Time slots with start/end times
  - Task duration display
  - Total time calculation
  - Color-coded priority levels

### Technical Implementation
- **Component**: `TimetableComponent` (`src/app/components/timetable/timetable.component.ts`)
- **Firestore Collections**: 
  - `timetables/{userId}` - Tasks
  - `schedules/{userId}` - Generated schedules
- **Models**: `TimetableTask`, `DailySchedule`, `ScheduleSlot`

### Data Structures
```typescript
TimetableTask {
  userId: string,
  taskName: string,
  estimatedTime: number,  // minutes
  priority: 'low' | 'medium' | 'high',
  createdAt: Date
}

DailySchedule {
  userId: string,
  date: Date,
  slots: ScheduleSlot[],
  createdAt: Date
}
```

### Algorithm
1. Sort tasks by priority (high → medium → low)
2. Start at 9:00 AM
3. For each task:
   - Create time slot
   - Add task duration
   - Add 10-minute break
4. Display complete schedule

---

## 🎴 5. Flashcard Study System

### Features
- **Card Creation**
  - Question/answer pairs
  - Optional category tagging
  - Unlimited cards per user
  
- **Study Mode**
  - Full-screen card display
  - Click-to-flip animation
  - Navigate between cards (previous/next)
  - Card counter (X of Y)
  
- **Organization**
  - Grid view of all cards
  - Category badges
  - Quick delete option

### Technical Implementation
- **Component**: `FlashcardComponent` (`src/app/components/flashcard/flashcard.component.ts`)
- **Firestore Collection**: `flashcards/{userId}`
- **Model**: `Flashcard` interface

### Data Structure
```typescript
{
  userId: string,
  question: string,
  answer: string,
  category: string,
  createdAt: Date,
  lastReviewed: Date
}
```

### CSS Animation
- **Flip Effect**: 3D transform with 0.6s transition
- **Front**: Question with blue gradient
- **Back**: Answer with green gradient

---

## 📚 6. Exam Preparation Q&A

### Features
- **Question Input**
  - Multi-line textarea for questions
  - Submit to get AI answers
  
- **Answer Display**
  - Chat-style Q&A format
  - Question badge (Q) and Answer badge (A)
  - Timestamp tracking
  
- **History Management**
  - All Q&A pairs saved in session
  - Clear history option
  - Newest questions first

### Technical Implementation
- **Component**: `ExamPrepComponent` (`src/app/components/exam-prep/exam-prep.component.ts`)
- **Service**: `AiService` (shared with Chat)
- **Storage**: Component state (not persisted to Firestore)

### Data Structure
```typescript
{
  question: string,
  answer: string,
  timestamp: Date
}
```

### Use Cases
- Quick exam questions
- Concept clarification
- Study session Q&A
- Practice problem solving

---

## 🎨 7. UI/UX Features

### Dark Mode
- **Toggle Button**: Moon/sun icon in navbar
- **Persistence**: Saved to localStorage
- **Scope**: Applied to entire application
- **Classes**: Tailwind's `dark:` variants

### Responsive Design
- **Mobile** (< 768px):
  - Hamburger menu
  - Stacked layouts
  - Touch-friendly buttons
  
- **Tablet** (768px - 1024px):
  - Adaptive grid layouts
  - Optimized spacing
  
- **Desktop** (> 1024px):
  - Full navigation bar
  - Multi-column layouts
  - Hover effects

### Navigation
- **Desktop**: Horizontal nav with all links
- **Mobile**: Hamburger menu with dropdown
- **Active Route**: Highlighted with background color
- **Branding**: "Cognitia" logo in header

### Design System
- **Colors**: 
  - Primary: Blue palette (#0ea5e9)
  - Success: Green
  - Error: Red
  - Neutral: Gray scale
  
- **Components**:
  - `.btn-primary` - Primary action buttons
  - `.btn-secondary` - Secondary buttons
  - `.card` - Content containers
  - `.input-field` - Form inputs
  
- **Animations**:
  - Smooth transitions (200ms)
  - Hover effects
  - Loading spinners
  - Flip cards

---

## 🔧 8. Technical Features

### Firebase Integration
- **Authentication**: Email/Password
- **Firestore**: Real-time database
- **Collections**:
  - `chats` - Chat messages
  - `todos` - To-do items
  - `timetables` - Timetable tasks
  - `schedules` - Generated schedules
  - `flashcards` - Study cards

### Data Security
- **User Isolation**: All data filtered by `userId`
- **Auth Guards**: Protected routes
- **Firestore Rules**: Server-side validation

### Performance
- **Lazy Loading**: Route-based code splitting
- **Real-time Updates**: Firestore listeners
- **Optimized Builds**: Production mode minification
- **Tree Shaking**: Unused code removal

### Code Architecture
- **Standalone Components**: Modern Angular 17
- **Services**: Centralized business logic
- **Models**: TypeScript interfaces
- **Guards**: Route protection
- **Reactive**: RxJS observables

---

## 🚀 9. Deployment Features

### Netlify Configuration
- **SPA Routing**: `_redirects` file for client-side routing
- **Build Command**: `npm run build`
- **Output Directory**: `dist/cognitia/browser`
- **Auto-deploy**: Git integration support

### Environment Management
- **Development**: `environment.ts`
- **Production**: `environment.prod.ts`
- **Firebase Config**: Separate per environment

---

## 📊 10. Future Enhancement Ideas

### Potential Features
- [ ] Email verification
- [ ] Password reset
- [ ] User avatars
- [ ] Flashcard spaced repetition
- [ ] Timetable recurring tasks
- [ ] Todo categories/tags
- [ ] Export data (PDF, CSV)
- [ ] Collaboration features
- [ ] Mobile app (Ionic/Capacitor)
- [ ] Push notifications
- [ ] Calendar integration
- [ ] Study statistics dashboard
- [ ] Pomodoro timer
- [ ] Note-taking feature
- [ ] File attachments

---

## 🎓 User Guide Summary

### For Students
1. **Sign up** with your email
2. **Chat** with AI for homework help
3. **Create todos** for assignments
4. **Generate timetables** for study sessions
5. **Make flashcards** for exam prep
6. **Ask questions** in Exam Prep
7. **Toggle dark mode** for comfortable studying

### For Developers
- Clean, modular code structure
- TypeScript for type safety
- Firebase for backend
- Tailwind for styling
- Easy to extend and customize

---

**Version**: 1.0.0
**Last Updated**: 2025-09-30
