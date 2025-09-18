# GitHub Secrets Required for Deployment

## 1. FIREBASE_SERVICE_ACCOUNT (Required for Hosting)

This is used for deploying to Firebase Hosting.

### How to create:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `skinscore-afw5a`
3. Click the gear icon → Project Settings
4. Go to "Service accounts" tab
5. Click "Generate new private key"
6. Download the JSON file

### Add to GitHub:
1. Go to your repository settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `FIREBASE_SERVICE_ACCOUNT`
5. Value: Paste the entire JSON content from the downloaded file
6. Click "Add secret"

## 2. FIREBASE_TOKEN (Required for Functions, Rules, and Indexes)

This is used for deploying Firebase Functions, Firestore rules, and indexes.

### How to create:
1. Install Firebase CLI locally: `npm install -g firebase-tools`
2. Run: `firebase login:ci`
3. Follow the browser prompts to authenticate
4. Copy the token that's displayed

### Add to GitHub:
1. Go to your repository settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `FIREBASE_TOKEN`
5. Value: Paste the token from step 4
6. Click "Add secret"

## Deployment Workflows

### 1. Main Branch Deployment (ci.yml)
- Triggers on push to `main`
- Deploys hosting to production

### 2. Firebase Services Deployment (deploy-firebase.yml)
- Triggers when functions or rules change on `main`
- Deploys:
  - Cloud Functions
  - Firestore Rules
  - Firestore Indexes
  - Storage Rules

### 3. Preview Deployments (preview-deploy.yml)
- Triggers on pull requests
- Creates preview URLs for testing
- Expires after 30 days

## Testing Deployment

After adding both secrets:

1. Make a small change to README.md
2. Push to main: `git push origin main`
3. Check Actions tab on GitHub to see deployment status
4. Your app will be live at: https://skinscore-afw5a.web.app

## Troubleshooting

If deployment fails:
- Ensure both secrets are added correctly
- Check that the Firebase project ID is correct: `skinscore-afw5a`
- Verify you have the necessary permissions in Firebase Console
- Check GitHub Actions logs for specific error messages