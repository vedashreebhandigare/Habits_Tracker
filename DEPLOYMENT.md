# 🚀 Quick Deployment Guide

## Option 1: Vercel (Recommended - Easiest)

1. **Create a GitHub repository and push your code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Habit Tracker"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Click "Deploy" (Vercel auto-detects Vite settings)
   - Done! Your app will be live in ~1 minute

## Option 2: Netlify

1. **Push code to GitHub** (same as above)

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "Add new site" → "Import an existing project"
   - Choose your repository
   - Settings should auto-fill:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

## Option 3: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   Add these scripts:
   ```json
   "homepage": "https://<your-username>.github.io/<repo-name>",
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. **Update vite.config.js:**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/<repo-name>/'
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

## Option 4: Build Locally and Host Anywhere

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to any static hosting service:
   - Firebase Hosting
   - AWS S3
   - Azure Static Web Apps
   - Cloudflare Pages
   - Any web server

## Testing Your Deployment

After deployment, test:
- ✅ All 4 tabs work (Dashboard, Daily Tracker, Analytics, Manage Habits)
- ✅ Can add/edit/delete habits
- ✅ Checkboxes work in Daily Tracker
- ✅ Charts display correctly in Analytics
- ✅ Data persists after page refresh
- ✅ Responsive design on mobile

## Notes

- **Data Storage**: Uses localStorage (browser-based, device-specific)
- **No Backend Needed**: Fully client-side application
- **Free Hosting**: All recommended options have generous free tiers
- **Custom Domain**: Can add custom domain on Vercel/Netlify (optional)

---

**Need help?** Check the main README.md for detailed instructions.
