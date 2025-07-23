
# Firebase Setup Instructions

## 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "ecommerce-auth")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication
1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started" if this is your first time
3. Go to the "Sign-in method" tab
4. Click on "Email/Password"
5. Enable the first option (Email/Password)
6. Click "Save"

## 3. Register Your Web App
1. In the Firebase console, click the gear icon and select "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Enter your app nickname (e.g., "E-commerce Frontend")
5. Check "Also set up Firebase Hosting" if you want to deploy on Firebase
6. Click "Register app"

## 4. Get Configuration Keys
After registering your app, you'll see your Firebase configuration. Copy these values:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 5. Update Configuration
1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase configuration
3. Save the file

## 6. Test Your Setup
1. Run your project
2. Try creating a new account
3. Try logging in with the created account
4. Check the Firebase Console > Authentication > Users to see registered users

## Security Rules (Optional)
For additional security, you can set up Firestore security rules if you plan to add a database later.

## Deployment
When ready to deploy, you can use Firebase Hosting:
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init`
4. Deploy: `firebase deploy`

## Troubleshooting
- Make sure all Firebase URLs in your config match your project
- Check browser console for any errors
- Verify that Email/Password authentication is enabled
- Ensure your domain is authorized in Firebase Authentication settings
