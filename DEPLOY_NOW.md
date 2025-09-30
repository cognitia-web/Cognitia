# 🚀 Deploy to Netlify - Quick Guide

## ✅ All Build Errors Fixed!

The following issues have been resolved:
- ✅ Firebase Timestamp `.toDate()` errors
- ✅ Template arrow function errors  
- ✅ Undefined property access errors
- ✅ Missing environment file

---

## 🔥 Before You Deploy - CRITICAL STEP

### Update Firebase Configuration

**You MUST update your Firebase config before deploying!**

1. Open `src/environments/environment.ts`
2. Replace placeholder values with your actual Firebase config:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSy...",              // Your actual API key
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123:web:abc123"
  }
};
```

3. Also update `src/environments/environment.prod.ts` (set `production: true`)

**Where to find your Firebase config:**
- Go to [Firebase Console](https://console.firebase.google.com)
- Select your project
- Click the gear icon → Project settings
- Scroll down to "Your apps" → Web app
- Copy the config object

---

## 🏗️ Build & Deploy

### Option 1: Netlify CLI (Recommended)

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Build the project
npm run build

# 3. Deploy to Netlify
netlify deploy --prod --dir=dist/cognitia/browser
```

### Option 2: Netlify Git Integration

```bash
# 1. Commit your changes
git add .
git commit -m "Add Firebase config and fix build errors"
git push

# 2. Netlify will auto-deploy
# (if you've connected your repository)
```

### Option 3: Drag & Drop

```bash
# 1. Build the project
npm run build

# 2. Go to https://app.netlify.com/drop
# 3. Drag the dist/cognitia/browser folder
```

---

## ✅ Verify Build Locally First

Before deploying, test the build:

```bash
npm run build
```

**Expected output:**
```
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Build at: 2025-XX-XXTXX:XX:XX
```

**If you see errors**, check:
- Firebase config is updated
- All dependencies installed (`npm install`)
- Node version is 18+ (`node --version`)

---

## 🎯 What Was Fixed

### 1. Timestamp Handling
Added helper methods to handle Firebase Timestamps properly:
- `ChatComponent.getTimestamp()`
- `TodoComponent.getDeadlineString()`

### 2. Template Logic
Moved complex logic from templates to component methods:
- `TimetableComponent.getTotalDuration()`

### 3. Null Safety
Fixed undefined property access in ProfileComponent

### 4. Environment File
Created `environment.ts` with placeholder values (you need to update it!)

**See `BUILD_FIXES.md` for detailed explanations.**

---

## 🔍 Troubleshooting

### Build fails with "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Build fails with Firebase errors
- Check that you updated `environment.ts` with real Firebase config
- Verify Firebase project exists and services are enabled

### Netlify build fails
- Check build logs in Netlify dashboard
- Ensure Node version is 18+ (add `.nvmrc` file with `18`)
- Verify `netlify.toml` is correct

---

## 📝 Deployment Checklist

Before deploying, ensure:
- [ ] Firebase config updated in `environment.ts`
- [ ] Firebase config updated in `environment.prod.ts`
- [ ] Local build succeeds (`npm run build`)
- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] All changes committed to git (if using Git integration)

---

## 🎉 After Deployment

### Test Your Deployed App
1. Visit your Netlify URL
2. Try signing up with a test account
3. Test all features:
   - Chat
   - To-Do List
   - Timetable
   - Flashcards
   - Exam Prep
   - Profile

### Update Firestore Rules
For production, update security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection}/{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 🆘 Need Help?

1. **Check BUILD_FIXES.md** - Detailed explanation of all fixes
2. **Check DEPLOYMENT_CHECKLIST.md** - Complete deployment guide
3. **Check Netlify logs** - For deployment-specific errors
4. **Check browser console** - For runtime errors

---

## 🚀 Quick Deploy Commands

```bash
# One-liner to build and deploy
npm install && npm run build && netlify deploy --prod --dir=dist/cognitia/browser
```

---

**Ready to deploy!** Just update your Firebase config and run the build command. 🎉
