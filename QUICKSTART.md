# Cognitia - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Firebase Setup (2 min)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Click "Add project" → Enter "Cognitia" → Continue
   - Disable Google Analytics (optional) → Create project

2. **Add Web App**
   - Click the web icon `</>` 
   - Register app nickname: "Cognitia Web"
   - Copy the config object

3. **Enable Services**
   - **Authentication**: Click "Get started" → Enable "Email/Password"
   - **Firestore**: Click "Create database" → Start in test mode → Select region

### Step 3: Configure Environment (1 min)

Copy the example file:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Edit `src/environments/environment.ts` and paste your Firebase config:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIza...",              // Paste your values here
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123:web:abc123"
  }
};
```

### Step 4: Run the App (1 min)
```bash
npm start
```

Open http://localhost:4200 in your browser! 🎉

---

## 🎯 First Time Usage

1. **Sign Up**
   - Click "Sign up" on the login page
   - Enter email and password (min 6 characters)
   - You'll be redirected to the Chat page

2. **Explore Features**
   - **Chat**: Ask questions to the AI assistant
   - **To-Do**: Create tasks with deadlines
   - **Timetable**: Add tasks and generate a schedule
   - **Flashcards**: Create study cards and use study mode
   - **Exam Prep**: Get answers to exam questions
   - **Profile**: View your account info

3. **Toggle Dark Mode**
   - Click the moon/sun icon in the navbar

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/cognitia/browser/`

---

## 🌐 Deploy to Netlify

### Option A: Drag & Drop
1. Build: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag `dist/cognitia/browser` folder

### Option B: CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist/cognitia/browser
```

### Option C: Git Integration
1. Push code to GitHub
2. Connect repository in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist/cognitia/browser`

---

## ❓ Troubleshooting

**Can't login?**
- Check Firebase Authentication is enabled
- Verify environment.ts has correct config

**Build errors?**
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

**Firestore not saving?**
- Check Firestore database is created
- Verify you're in test mode (for development)

---

## 🎓 What's Next?

- **Customize AI Service**: Edit `src/app/services/ai.service.ts` to use real AI API
- **Update Firestore Rules**: Add security rules for production
- **Add Features**: Extend with more components
- **Customize Theme**: Edit `tailwind.config.js` colors

---

**Need Help?** Check SETUP.md for detailed instructions!
