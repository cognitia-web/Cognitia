# Cognitia

A comprehensive student productivity platform built with Angular 17+ and Firebase.

## Features

- 🔐 **Authentication** - Secure email/password authentication with Firebase
- 💬 **AI Chat Interface** - ChatGPT-like interface for student queries
- ✅ **To-Do List** - Task management with deadlines
- 📅 **Smart Timetable** - Auto-generate daily schedules from tasks
- 🎴 **Flashcards** - Create and study with interactive flashcards
- 📚 **Exam Prep** - AI-powered Q&A for exam preparation
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop

## Tech Stack

- **Angular 17+** - Modern web framework
- **Firebase** - Authentication and Firestore database
- **Tailwind CSS** - Utility-first CSS framework
- **AngularFire** - Official Angular library for Firebase

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Email/Password authentication
   - Create a Firestore database
   - Copy your Firebase config to `src/environments/environment.ts`:
     ```typescript
     export const environment = {
       production: false,
       firebase: {
         apiKey: "YOUR_API_KEY",
         authDomain: "YOUR_AUTH_DOMAIN",
         projectId: "YOUR_PROJECT_ID",
         storageBucket: "YOUR_STORAGE_BUCKET",
         messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
         appId: "YOUR_APP_ID"
       }
     };
     ```

3. Run the development server:
   ```bash
   npm start
   ```

4. Navigate to `http://localhost:4200/`

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/cognitia` directory.

## Deployment to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/cognitia` folder to Netlify

The project includes a `_redirects` file for proper SPA routing on Netlify.

## Project Structure

```
src/
├── app/
│   ├── components/        # Feature components
│   ├── guards/           # Route guards
│   ├── services/         # Services (Auth, AI, Firestore)
│   ├── models/           # TypeScript interfaces
│   └── app.component.*   # Root component
├── environments/         # Environment configurations
└── styles.css           # Global styles with Tailwind
```

## License

MIT
