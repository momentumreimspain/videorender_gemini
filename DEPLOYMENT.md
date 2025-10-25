# 🚀 Deployment Instructions

## Vercel Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Configure Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables

Add the following variables (get them from Firebase Console):

```
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

**Important**: Add these variables to **all environments** (Production, Preview, Development)

### 3. Redeploy

After adding the environment variables, trigger a new deployment:
- Go to Deployments tab
- Click on the three dots next to the latest deployment
- Select "Redeploy"

### Common Issues

#### 404 on index.css
✅ **Fixed**: Removed the unused index.css link from index.html

#### Firebase Invalid API Key
This happens when environment variables are not set in Vercel.

**Solution**:
1. Go to Vercel Project Settings
2. Navigate to Environment Variables
3. Add all VITE_FIREBASE_* variables
4. Redeploy the project

#### CORS Issues
Make sure your Firebase Storage rules allow reading files:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Build Command
Vercel should automatically detect Vite and use:
```bash
npm run build
```

## Output Directory
```
dist
```

## Framework Preset
**Vite**

---

✅ Once environment variables are set, your app should work perfectly in production!
