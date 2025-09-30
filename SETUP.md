# Cognitia Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Firebase account

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Configuration

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" and follow the setup wizard
3. Once created, click on the web icon (</>) to add a web app
4. Register your app with a nickname (e.g., "Cognitia")
5. Copy the Firebase configuration object

#### Enable Firebase Services
1. **Authentication:**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   
2. **Firestore Database:**
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (for development)
   - Choose a location close to you

#### Configure Firebase in Your App
1. Copy `src/environments/environment.example.ts` to `src/environments/environment.ts`
2. Replace the placeholder values with your Firebase config:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

3. Update `src/environments/environment.prod.ts` with the same configuration (set `production: true`)

### 3. Firestore Security Rules (Optional but Recommended)

In Firebase Console, go to Firestore Database > Rules and update:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /chats/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /todos/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /timetables/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /schedules/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /flashcards/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 4. Run Development Server
```bash
npm start
```

Navigate to `http://localhost:4200/`

### 5. Build for Production
```bash
npm run build
```

The build artifacts will be in `dist/cognitia/browser/`

## Deployment to Netlify

### Option 1: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist/cognitia/browser
```

### Option 2: Netlify Web Interface
1. Build the project: `npm run build`
2. Go to [Netlify](https://app.netlify.com)
3. Drag and drop the `dist/cognitia/browser` folder
4. Or connect your Git repository for automatic deployments

### Option 3: Connect Git Repository
1. Push your code to GitHub/GitLab/Bitbucket
2. In Netlify, click "New site from Git"
3. Connect your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/cognitia/browser`
5. Click "Deploy site"

## Environment Variables for Production

If deploying to Netlify, you can set environment variables:
1. Go to Site settings > Build & deploy > Environment
2. Add your Firebase config as environment variables
3. Update your build process to use these variables

## Features Overview

### 🔐 Authentication
- Email/Password signup and login
- Protected routes with auth guards
- User profile management

### 💬 AI Chat Interface
- ChatGPT-like interface
- Messages stored in Firestore
- Real-time message updates

### ✅ To-Do List
- Create, read, update, delete tasks
- Set deadlines
- Mark tasks as complete
- Visual indicators for overdue tasks

### 📅 Smart Timetable
- Add tasks with estimated time
- Set priority levels
- Auto-generate daily schedule
- 10-minute breaks between tasks

### 🎴 Flashcards
- Create question/answer flashcards
- Organize by category
- Study mode with flip animation
- Navigate through cards

### 📚 Exam Preparation
- Ask questions and get AI-powered answers
- Q&A history
- Timestamp tracking

### 🌙 Dark Mode
- Toggle between light and dark themes
- Preference saved in localStorage

### 📱 Responsive Design
- Mobile-friendly navigation
- Adaptive layouts for all screen sizes

## Troubleshooting

### Firebase Connection Issues
- Verify your Firebase config is correct
- Check that Authentication and Firestore are enabled
- Ensure you're using the web app config (not iOS/Android)

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Angular cache: `rm -rf .angular`
- Update Angular CLI: `npm install -g @angular/cli@latest`

### Netlify Deployment Issues
- Ensure `_redirects` file is in the build output
- Check build logs for errors
- Verify the publish directory is correct

## AI Service Integration

The app currently uses a mock AI service. To integrate a real AI API:

1. Open `src/app/services/ai.service.ts`
2. Replace the mock implementation with your API:

```typescript
askQuestion(question: string): Observable<string> {
  return this.http.post<{answer: string}>(this.apiUrl, { question }).pipe(
    map(response => response.answer)
  );
}
```

3. Update `apiUrl` with your actual endpoint
4. Add any required API keys to environment variables

## Support

For issues or questions:
- Check the README.md
- Review Firebase documentation
- Check Angular documentation
- Review Netlify deployment guides

## License
MIT
