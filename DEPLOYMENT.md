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

### 4. Configure Firebase Rules

**IMPORTANT**: You MUST configure Firebase rules or the app won't work!

#### Apply Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. Copy the content from `firestore.rules` file
5. Click **Publish**

Or use Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

#### Apply Storage Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Storage** → **Rules** tab
4. Copy the content from `storage.rules` file
5. Click **Publish**

Or use Firebase CLI:
```bash
firebase deploy --only storage
```

### Common Issues

#### Missing or insufficient permissions
This happens when Firebase rules are not configured.

**Solution**: Apply the rules from `firestore.rules` and `storage.rules` files (see above)

#### CORS Issues in Storage
Make sure you've applied the `storage.rules` file correctly. The rules allow:
- ✅ Anyone can READ files (for viewing in gallery)
- ✅ Only authenticated users can WRITE to their own folders
- ✅ Only owners can DELETE their files

#### 404 on index.css
✅ **Fixed**: Removed the unused index.css link from index.html

#### Firebase Invalid API Key
This happens when environment variables are not set in Vercel.

**Solution**:
1. Go to Vercel Project Settings
2. Navigate to Environment Variables
3. Add all VITE_FIREBASE_* variables
4. Redeploy the project

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
