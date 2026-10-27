# 🚀 SkillBridge AI — Production Deployment Guide

This guide walks through deploying the **SkillBridge AI** web application to **Vercel** (and Netlify) with full Single-Page Application (SPA) routing and PWA caching enabled.

---

## 🎯 Repository Status
- **GitHub Repository**: [`https://github.com/leenasriM/AI-based-skill-bridge.git`](https://github.com/leenasriM/AI-based-skill-bridge.git)
- **Branch**: `main` (Latest commit includes SPA routing `vercel.json` & `_redirects`)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: `Vite` (React 19 + TypeScript + Tailwind CSS)

---

## ⚡ Option 1: Deploy to Vercel via GitHub (Recommended - 60 Seconds)

Because all code and deployment configs are already committed and pushed to GitHub, deploying takes less than 1 minute:

### Step 1: Sign In to Vercel
1. Open [**vercel.com**](https://vercel.com) in your browser.
2. Click **"Log In"** or **"Sign Up"** and select **"Continue with GitHub"**.

### Step 2: Import the Repository
1. On your Vercel Dashboard, click the blue **"Add New..."** button (top right) and choose **"Project"**.
2. Find `leenasriM/AI-based-skill-bridge` in your repository list.
   *(If not visible, click "Configure GitHub App" to give Vercel access to the repository).*
3. Click the blue **"Import"** button next to the repo.

### Step 3: Configure Project Settings
Vercel automatically detects the Vite configuration:
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (leave default)
- **Build Command**: `npm run build` (or leave default)
- **Output Directory**: `dist` (or leave default)
- **Install Command**: `npm install` (or leave default)

### Step 4: Click Deploy!
1. Click **"Deploy"**.
2. Vercel will install dependencies, compile the TypeScript code, bundle assets with Vite, and generate your production URL.
3. In ~45 seconds, confetti will burst and you will receive your live URL:
   ```
   https://ai-based-skill-bridge.vercel.app
   ```
   *(or a custom alias like `https://skillbridge-ai.vercel.app`)*

---

## 💻 Option 2: Deploy to Vercel via Terminal (CLI)

If you prefer deploying directly from your terminal:

```bash
# Run Vercel CLI directly without global installation
npx vercel
```
1. Press `Enter` to confirm: `Set up and deploy "~/Downloads/AI based skill-bridge"? [Y/n]` -> **Y**
2. Which scope? -> Choose your account
3. Link to existing project? -> **N**
4. What's your project's name? -> `skillbridge-ai`
5. In which directory is your code located? -> `./`
6. Want to modify these settings? -> **N** (Vercel auto-detects Vite)

To deploy to production:
```bash
npx vercel --prod
```

---

## 🌐 Option 3: Netlify (Instant Drag & Drop Backup)

We also configured `netlify.toml` and `public/_redirects`:

1. Open [**app.netlify.com/drop**](https://app.netlify.com/drop).
2. Log in with your GitHub or email.
3. Open Finder on your Mac and drag the folder:
   `/Users/mk/Downloads/AI based skill-bridge/dist`
   directly into the browser upload box.
4. Your site will be live immediately!

---

## ✅ Post-Deployment Verification Checklist

Once deployed, verify that the following critical paths work properly:

| Test Item | What to check | Expected Result |
| :--- | :--- | :--- |
| **Home Page** | Navigate to `https://<your-app>.vercel.app` | Hero section, dynamic metrics, and CTA buttons render |
| **Direct URL Routing** | Refresh page on `https://<your-app>.vercel.app/readiness` | Loads Readiness page without 404 (handled by `vercel.json`) |
| **All Main Routes** | Test `/passport`, `/challenges`, `/roadmap`, `/employer` | Each view loads smoothly with zero console errors |
| **Multi-Language Switch** | Toggle English / Tamil in header | UI text translates seamlessly |
| **Interactive Modals** | Click "Voice Practice" or "Quick Viva" | Speech recognition & AI feedback simulate correctly |
| **PWA Service Worker** | Open DevTools -> Application -> Service Workers | Active and running `sw.js` for offline caching |

---

## 🛠️ Included Routing Configurations

### 1. `vercel.json`
Ensures all deep links (`/readiness`, `/challenges`, etc.) route to `index.html` on Vercel without throwing 404 errors:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. `netlify.toml`
Enables the same fallback routing on Netlify:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
