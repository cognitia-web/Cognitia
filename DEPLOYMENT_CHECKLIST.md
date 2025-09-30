# Cognitia - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Firebase Configuration
- [ ] Firebase project created
- [ ] Email/Password authentication enabled
- [ ] Firestore database created
- [ ] Firebase config added to `src/environments/environment.ts`
- [ ] Firebase config added to `src/environments/environment.prod.ts` (with `production: true`)

### 2. Security Rules (Firestore)
- [ ] Update Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
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

### 3. Local Testing
- [ ] Run `npm install` successfully
- [ ] Run `npm start` and test locally
- [ ] Test user signup
- [ ] Test user login
- [ ] Test all features (Chat, Todo, Timetable, Flashcards, Exam Prep)
- [ ] Test dark mode toggle
- [ ] Test mobile responsiveness
- [ ] Test logout functionality

### 4. Build Verification
- [ ] Run `npm run build` successfully
- [ ] Check `dist/cognitia/browser` folder exists
- [ ] Verify `_redirects` file is in build output
- [ ] Check build size is reasonable (< 5MB)

### 5. Code Quality
- [ ] No console errors in browser
- [ ] No TypeScript compilation errors
- [ ] All routes working correctly
- [ ] Auth guard protecting routes properly

## 🚀 Netlify Deployment Steps

### Method 1: Netlify CLI (Recommended)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist/cognitia/browser
   ```

5. **Verify Deployment**
   - [ ] Visit the deployed URL
   - [ ] Test signup/login
   - [ ] Test all features
   - [ ] Test on mobile device

### Method 2: Git Integration

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Initial commit - Cognitia v1.0"
   git push origin main
   ```

2. **Connect to Netlify**
   - [ ] Go to https://app.netlify.com
   - [ ] Click "New site from Git"
   - [ ] Connect your repository
   - [ ] Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist/cognitia/browser`
   - [ ] Click "Deploy site"

3. **Configure Environment Variables (if needed)**
   - [ ] Go to Site settings > Build & deploy > Environment
   - [ ] Add any required environment variables

### Method 3: Manual Upload

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Upload to Netlify**
   - [ ] Go to https://app.netlify.com/drop
   - [ ] Drag and drop `dist/cognitia/browser` folder

## 🔒 Post-Deployment Security

### Firebase Security
- [ ] Change Firestore rules from "test mode" to production rules
- [ ] Enable email verification (optional)
- [ ] Set up password reset email templates
- [ ] Configure authorized domains in Firebase Console

### Netlify Security
- [ ] Enable HTTPS (automatic with Netlify)
- [ ] Configure custom domain (optional)
- [ ] Set up form spam protection (if using forms)
- [ ] Enable branch deploys for staging (optional)

## 🧪 Post-Deployment Testing

- [ ] Test signup with new account
- [ ] Test login with existing account
- [ ] Create a chat message
- [ ] Add a todo item
- [ ] Generate a timetable
- [ ] Create a flashcard
- [ ] Ask an exam prep question
- [ ] Toggle dark mode
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test logout

## 📊 Monitoring & Analytics (Optional)

- [ ] Set up Firebase Analytics
- [ ] Configure error tracking (e.g., Sentry)
- [ ] Set up performance monitoring
- [ ] Configure Netlify Analytics

## 🔄 Continuous Deployment

If using Git integration:
- [ ] Every push to main branch auto-deploys
- [ ] Set up staging branch for testing
- [ ] Configure deploy previews for pull requests

## 🐛 Common Issues & Solutions

### Issue: Build fails on Netlify
**Solution**: Check Node.js version
- Add `.nvmrc` file with version: `18`
- Or set in Netlify: Site settings > Build & deploy > Environment > NODE_VERSION = 18

### Issue: Routes return 404
**Solution**: Verify `_redirects` file
- Check file exists in build output
- Content should be: `/*    /index.html   200`

### Issue: Firebase connection fails
**Solution**: Check environment variables
- Verify production config in `environment.prod.ts`
- Ensure all Firebase keys are correct

### Issue: Firestore permission denied
**Solution**: Update security rules
- Check rules allow authenticated users
- Verify userId matching in rules

## 📝 Final Checklist

- [ ] Application is live and accessible
- [ ] All features working in production
- [ ] Mobile responsive
- [ ] Dark mode working
- [ ] Firebase security rules updated
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Documentation is up to date

## 🎉 Deployment Complete!

Your Cognitia app is now live and ready for students to use!

### Next Steps:
1. Share the URL with users
2. Gather feedback
3. Monitor for errors
4. Plan future enhancements

---

**Deployment Date**: _____________
**Deployed URL**: _____________
**Deployed By**: _____________
