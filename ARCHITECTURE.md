# Cognitia - Architecture Documentation

## 🏗️ Application Architecture

---

## Component Tree

```
AppComponent (Root)
├── Navigation Bar (conditional)
│   ├── Logo: "Cognitia"
│   ├── Desktop Menu
│   │   ├── Chat Link
│   │   ├── To-Do Link
│   │   ├── Timetable Link
│   │   ├── Flashcards Link
│   │   ├── Exam Prep Link
│   │   └── Profile Link
│   ├── Dark Mode Toggle
│   └── Mobile Menu (hamburger)
│
└── Router Outlet
    ├── LoginComponent (public)
    ├── SignupComponent (public)
    ├── ChatComponent (protected)
    ├── TodoComponent (protected)
    ├── TimetableComponent (protected)
    ├── FlashcardComponent (protected)
    ├── ExamPrepComponent (protected)
    └── ProfileComponent (protected)
```

---

## Service Architecture

```
Services Layer
├── AuthService
│   ├── signup(email, password)
│   ├── login(email, password)
│   ├── logout()
│   ├── getCurrentUser()
│   └── user$ (Observable)
│
├── AiService
│   └── askQuestion(question) → Observable<string>
│
└── ThemeService
    ├── toggleDarkMode()
    ├── isDarkMode()
    └── applyTheme()
```

---

## Data Flow Architecture

### Authentication Flow
```
User Action (Login/Signup)
    ↓
LoginComponent / SignupComponent
    ↓
AuthService
    ↓
Firebase Authentication
    ↓
User Observable (user$)
    ↓
Auth Guard (route protection)
    ↓
Protected Components
```

### Data CRUD Flow
```
User Action (Create/Read/Update/Delete)
    ↓
Component (Chat/Todo/Timetable/Flashcard)
    ↓
Firestore Methods (addDoc/query/updateDoc/deleteDoc)
    ↓
Firebase Firestore
    ↓
Real-time Listener (onSnapshot)
    ↓
Component State Update
    ↓
UI Re-render
```

### AI Query Flow
```
User Question
    ↓
Component (Chat/ExamPrep)
    ↓
AiService.askQuestion()
    ↓
[Placeholder API / Mock Response]
    ↓
Observable Response
    ↓
Component Displays Answer
```

---

## Routing Architecture

```
Routes Configuration (app.routes.ts)
│
├── '' (root) → Redirect to /login
│
├── Public Routes
│   ├── /login → LoginComponent
│   └── /signup → SignupComponent
│
├── Protected Routes (authGuard)
│   ├── /chat → ChatComponent
│   ├── /todo → TodoComponent
│   ├── /timetable → TimetableComponent
│   ├── /flashcards → FlashcardComponent
│   ├── /exam-prep → ExamPrepComponent
│   └── /profile → ProfileComponent
│
└── '**' (wildcard) → Redirect to /login
```

---

## State Management

### Component-Level State
Each component manages its own state:

```typescript
// Example: TodoComponent
{
  todos: Todo[],           // List of todos
  showAddForm: boolean,    // Form visibility
  newTodo: Partial<Todo>   // Form data
}
```

### Service-Level State
Services provide shared state via Observables:

```typescript
// AuthService
user$: Observable<User | null>  // Current user state

// ThemeService
darkMode: boolean               // Theme state
```

### Firestore Real-time State
Real-time listeners keep data synchronized:

```typescript
onSnapshot(query, (snapshot) => {
  this.data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
});
```

---

## Security Architecture

### Client-Side Security
```
Route Protection
    ↓
Auth Guard
    ↓
Check user$ Observable
    ↓
Allow/Deny Access
```

### Server-Side Security (Firestore Rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User must be authenticated
    match /{collection}/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## File Structure Architecture

```
src/
├── app/
│   ├── components/           # UI Components
│   │   ├── chat/
│   │   │   ├── chat.component.ts      # Logic
│   │   │   ├── chat.component.html    # Template
│   │   │   └── chat.component.css     # Styles
│   │   └── [other components...]
│   │
│   ├── services/            # Business Logic
│   │   ├── auth.service.ts
│   │   ├── ai.service.ts
│   │   └── theme.service.ts
│   │
│   ├── guards/              # Route Protection
│   │   └── auth.guard.ts
│   │
│   ├── models/              # TypeScript Interfaces
│   │   ├── user.model.ts
│   │   ├── chat.model.ts
│   │   ├── todo.model.ts
│   │   ├── timetable.model.ts
│   │   └── flashcard.model.ts
│   │
│   ├── app.component.*      # Root Component
│   └── app.routes.ts        # Routing Config
│
├── environments/            # Configuration
│   ├── environment.ts       # Development
│   └── environment.prod.ts  # Production
│
├── assets/                  # Static Files
├── styles.css              # Global Styles
├── index.html              # Entry HTML
└── main.ts                 # Bootstrap
```

---

## Dependency Injection Architecture

```
Angular Injector
├── Root Level
│   ├── AuthService (providedIn: 'root')
│   ├── AiService (providedIn: 'root')
│   └── ThemeService (providedIn: 'root')
│
├── Firebase Providers
│   ├── provideFirebaseApp()
│   ├── provideAuth()
│   └── provideFirestore()
│
└── Router Providers
    ├── provideRouter()
    ├── provideAnimations()
    └── provideHttpClient()
```

---

## Build Architecture

### Development Build
```
Source Code (TypeScript)
    ↓
TypeScript Compiler
    ↓
JavaScript (ES2022)
    ↓
Webpack Dev Server
    ↓
Hot Module Replacement
    ↓
Browser (localhost:4200)
```

### Production Build
```
Source Code
    ↓
TypeScript Compiler
    ↓
Tree Shaking (remove unused code)
    ↓
Minification
    ↓
Bundling
    ↓
Hashing (cache busting)
    ↓
Output: dist/cognitia/browser/
    ├── index.html
    ├── main.[hash].js
    ├── polyfills.[hash].js
    ├── styles.[hash].css
    └── assets/
```

---

## Styling Architecture

### Tailwind CSS Layers
```
@tailwind base;        # Reset & base styles
@tailwind components;  # Component classes
@tailwind utilities;   # Utility classes

Custom Components
├── .btn-primary
├── .btn-secondary
├── .input-field
├── .card
└── .flip-card
```

### Dark Mode Strategy
```
HTML Element
├── class="dark" (when enabled)
│
└── All child elements use dark: variants
    ├── dark:bg-gray-900
    ├── dark:text-gray-100
    └── dark:border-gray-700
```

---

## Deployment Architecture

### Netlify Deployment Flow
```
Git Push (optional)
    ↓
Netlify Build Server
    ↓
npm install
    ↓
npm run build
    ↓
Output: dist/cognitia/browser/
    ↓
Netlify CDN
    ↓
Public URL
```

### SPA Routing
```
User requests /chat
    ↓
Netlify checks _redirects file
    ↓
Redirects to /index.html (200)
    ↓
Angular Router takes over
    ↓
Loads ChatComponent
```

---

## Performance Architecture

### Lazy Loading Strategy
```
Initial Bundle
├── AppComponent
├── LoginComponent
├── SignupComponent
└── Core Services

Route-based Chunks (loaded on demand)
├── chat-component.js
├── todo-component.js
├── timetable-component.js
├── flashcard-component.js
├── exam-prep-component.js
└── profile-component.js
```

### Optimization Techniques
- **Tree Shaking**: Remove unused code
- **Minification**: Compress JavaScript/CSS
- **Code Splitting**: Route-based chunks
- **Lazy Loading**: Load on demand
- **AOT Compilation**: Ahead-of-time compilation
- **Production Mode**: Optimized builds

---

## Error Handling Architecture

### Component Level
```typescript
try {
  await this.authService.login(email, password);
} catch (error: any) {
  this.error = error.message;
  // Display to user
}
```

### Service Level
```typescript
async login(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/chat']);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
```

### Global Error Handling
- Browser console logs
- Firebase error codes
- User-friendly error messages
- Form validation errors

---

## Real-time Data Architecture

### Firestore Listeners
```typescript
// Subscribe to real-time updates
const q = query(
  collection(firestore, 'todos'),
  where('userId', '==', userId),
  orderBy('createdAt', 'desc')
);

onSnapshot(q, (snapshot) => {
  // Automatically updates when data changes
  this.todos = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
});
```

### Benefits
- Instant updates across devices
- No manual refresh needed
- Synchronized data
- Real-time collaboration ready

---

## Testing Architecture (Future Enhancement)

### Unit Tests
```
Component Tests
├── LoginComponent.spec.ts
├── ChatComponent.spec.ts
└── [other components...]

Service Tests
├── AuthService.spec.ts
├── AiService.spec.ts
└── ThemeService.spec.ts
```

### E2E Tests
```
User Flows
├── signup.e2e.ts
├── login.e2e.ts
├── create-todo.e2e.ts
└── [other flows...]
```

---

## Scalability Considerations

### Current Architecture Supports
- Multiple concurrent users
- Real-time data synchronization
- Horizontal scaling (Firebase)
- CDN distribution (Netlify)
- Global availability

### Future Scaling Options
- Cloud Functions for backend logic
- Firebase Storage for file uploads
- Cloud Messaging for notifications
- Analytics for usage tracking
- A/B testing capabilities

---

## Design Patterns Used

### 1. Service Pattern
- Centralized business logic
- Reusable across components
- Dependency injection

### 2. Observer Pattern
- RxJS Observables
- Real-time data streams
- Event handling

### 3. Guard Pattern
- Route protection
- Authentication checks
- Authorization logic

### 4. Component Pattern
- Standalone components
- Encapsulated logic
- Reusable UI elements

### 5. Module Pattern
- Organized code structure
- Clear separation of concerns
- Maintainable codebase

---

## Technology Decisions

### Why Angular 17?
- Modern standalone components
- Built-in dependency injection
- TypeScript support
- Strong ecosystem
- Enterprise-ready

### Why Firebase?
- Real-time database
- Built-in authentication
- Scalable infrastructure
- Easy integration
- Free tier available

### Why Tailwind CSS?
- Utility-first approach
- Dark mode support
- Responsive design
- Small bundle size
- Customizable

### Why Netlify?
- Easy deployment
- SPA routing support
- CDN distribution
- Free tier
- Git integration

---

## Summary

Cognitia uses a **modern, scalable architecture** with:
- ✅ Component-based UI
- ✅ Service-oriented business logic
- ✅ Real-time data synchronization
- ✅ Secure authentication
- ✅ Responsive design
- ✅ Production-ready deployment

The architecture is designed for:
- **Maintainability**: Clear structure and patterns
- **Scalability**: Can handle growth
- **Performance**: Optimized builds
- **Security**: Protected routes and data
- **Developer Experience**: Easy to understand and extend

---

**Version**: 1.0.0  
**Last Updated**: 2025-09-30
