# Cognitia - Installation Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended
- **Web Browser**: Chrome, Firefox, Safari, or Edge

### Check Your Versions
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
git --version     # Any recent version
```

---

## 🚀 Installation Steps

### 1. Clone or Navigate to Project
```bash
cd Y:/Apps/Cognitia
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- Angular 17.3.0
- Firebase 10.12.0
- AngularFire 17.1.0
- Tailwind CSS 3.4.3
- TypeScript 5.4.2
- And all other dependencies

**Expected time**: 2-5 minutes depending on internet speed

### 3. Verify Installation
```bash
npm list --depth=0
```

You should see all packages listed without errors.

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name: `Cognitia` (or your preferred name)
4. Click **Continue**
5. Disable Google Analytics (optional for development)
6. Click **Create project**
7. Wait for project creation (30-60 seconds)
8. Click **Continue**

### Step 2: Register Web App

1. On the project overview page, click the **web icon** `</>`
2. Enter app nickname: `Cognitia Web`
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click **Register app**
5. **Copy the Firebase configuration** (you'll need this next)

Example config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "cognitia-xxxxx.firebaseapp.com",
  projectId: "cognitia-xxxxx",
  storageBucket: "cognitia-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

6. Click **Continue to console**

### Step 3: Enable Authentication

1. In the left sidebar, click **Authentication**
2. Click **Get started**
3. Click on **Email/Password** in the Sign-in method tab
4. Toggle **Enable** to ON
5. Click **Save**

### Step 4: Create Firestore Database

1. In the left sidebar, click **Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (for development)
4. Click **Next**
5. Choose a location (select closest to you)
6. Click **Enable**
7. Wait for database creation (30-60 seconds)

### Step 5: Configure Environment File

1. Copy the example environment file:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```

2. Open `src/environments/environment.ts` in your editor

3. Replace the placeholder values with your Firebase config:
   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: "YOUR_API_KEY",              // From Firebase config
       authDomain: "YOUR_AUTH_DOMAIN",      // From Firebase config
       projectId: "YOUR_PROJECT_ID",        // From Firebase config
       storageBucket: "YOUR_STORAGE_BUCKET", // From Firebase config
       messagingSenderId: "YOUR_SENDER_ID", // From Firebase config
       appId: "YOUR_APP_ID"                 // From Firebase config
     }
   };
   ```

4. Save the file

5. Also update `src/environments/environment.prod.ts`:
   ```typescript
   export const environment {
     production: true,  // Set to true for production
     firebase: {
       // Same config as above
     }
   };
   ```

---

## ✅ Verify Installation

### Run Development Server
```bash
npm start
```

You should see:
```
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

### Open in Browser
Navigate to: http://localhost:4200

You should see the Cognitia login page!

### Test Basic Functionality

1. **Sign Up**
   - Click "Sign up"
   - Enter email: `test@example.com`
   - Enter password: `test123` (min 6 chars)
   - Confirm password: `test123`
   - Click "Create Account"
   - You should be redirected to the Chat page

2. **Test Features**
   - Click through each nav item (Chat, To-Do, Timetable, etc.)
   - Each page should load without errors

3. **Test Dark Mode**
   - Click the moon icon in the navbar
   - Page should switch to dark theme

4. **Test Logout**
   - Go to Profile
   - Click "Sign Out"
   - You should be redirected to login

---

## 🔧 Troubleshooting

### Issue: `npm install` fails

**Solution 1**: Clear npm cache
```bash
npm cache clean --force
npm install
```

**Solution 2**: Delete node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

**Solution 3**: Use specific Node version
```bash
# Install nvm (Node Version Manager) if not installed
nvm install 18
nvm use 18
npm install
```

---

### Issue: Firebase connection error

**Error**: "Firebase: Error (auth/invalid-api-key)"

**Solution**: Check your environment.ts file
- Verify all Firebase config values are correct
- Ensure no extra spaces or quotes
- Make sure you copied from the web app config (not iOS/Android)

---

### Issue: Can't sign up/login

**Error**: "Firebase: Error (auth/operation-not-allowed)"

**Solution**: Enable Email/Password authentication
1. Go to Firebase Console
2. Authentication > Sign-in method
3. Enable Email/Password
4. Save

---

### Issue: Firestore permission denied

**Error**: "Missing or insufficient permissions"

**Solution**: Check Firestore rules
1. Go to Firebase Console
2. Firestore Database > Rules
3. Ensure rules allow test mode:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.time < timestamp.date(2025, 12, 31);
       }
     }
   }
   ```

---

### Issue: Build errors

**Error**: "Cannot find module '@angular/core'"

**Solution**: Reinstall Angular dependencies
```bash
npm install @angular/core @angular/common @angular/platform-browser
```

---

### Issue: Port 4200 already in use

**Error**: "Port 4200 is already in use"

**Solution**: Use a different port
```bash
ng serve --port 4300
```

Or kill the process using port 4200:
```bash
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4200 | xargs kill
```

---

## 🏗️ Build for Production

### Create Production Build
```bash
npm run build
```

Output location: `dist/cognitia/browser/`

### Verify Build
```bash
# Check if build folder exists
ls dist/cognitia/browser

# You should see:
# - index.html
# - main.*.js
# - polyfills.*.js
# - styles.*.css
# - _redirects
# - assets/
```

### Test Production Build Locally

Install a simple HTTP server:
```bash
npm install -g http-server
```

Serve the build:
```bash
cd dist/cognitia/browser
http-server
```

Open: http://localhost:8080

---

## 📦 Project Structure Verification

Ensure all files exist:

```
cognitia/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   ├── todo/
│   │   │   ├── timetable/
│   │   │   ├── flashcard/
│   │   │   ├── exam-prep/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── profile/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── chat.model.ts
│   │   │   ├── todo.model.ts
│   │   │   ├── timetable.model.ts
│   │   │   └── flashcard.model.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── ai.service.ts
│   │   │   └── theme.service.ts
│   │   ├── app.component.*
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts (create this)
│   │   ├── environment.prod.ts
│   │   └── environment.example.ts
│   ├── assets/
│   ├── styles.css
│   ├── index.html
│   └── main.ts
├── Configuration files
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── netlify.toml
└── Documentation
    ├── README.md
    ├── SETUP.md
    ├── QUICKSTART.md
    ├── FEATURES.md
    └── DEPLOYMENT_CHECKLIST.md
```

---

## ✨ Next Steps

After successful installation:

1. **Read Documentation**
   - `README.md` - Project overview
   - `QUICKSTART.md` - Quick start guide
   - `FEATURES.md` - Feature documentation
   - `SETUP.md` - Detailed setup

2. **Customize**
   - Update colors in `tailwind.config.js`
   - Modify components as needed
   - Integrate real AI API in `ai.service.ts`

3. **Deploy**
   - Follow `DEPLOYMENT_CHECKLIST.md`
   - Deploy to Netlify
   - Update Firestore security rules

---

## 🆘 Getting Help

### Check Console for Errors
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Common Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Clear Angular cache
rm -rf .angular

# Reinstall dependencies
rm -rf node_modules && npm install

# Check for updates
npm outdated
```

### Resources
- [Angular Documentation](https://angular.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [AngularFire Documentation](https://github.com/angular/angularfire)

---

## ✅ Installation Complete!

If you've reached this point successfully:
- ✅ Dependencies installed
- ✅ Firebase configured
- ✅ App running locally
- ✅ All features working

**You're ready to start developing or deploy to production!**

---

**Need help?** Check the other documentation files or create an issue on the repository.
