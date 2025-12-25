# Deployment Guide

This guide will help you deploy the Golf Helper app to a live website.

## Option 1: Vercel (Recommended - Easiest)

Vercel is free and perfect for Node.js apps.

### Steps:

1. **Install Vercel CLI** (if you haven't already):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   Follow the prompts. When asked:
   - Set up and deploy? **Yes**
   - Which scope? Choose your account
   - Link to existing project? **No**
   - Project name? `dads-golf-helper` (or your choice)
   - Directory? **./** (current directory)
   - Override settings? **No**

4. **Add Environment Variables**:
   After deployment, go to your Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Add:
     - `OPENWEATHER_API_KEY` = `your_openweather_api_key_here`
     - `OPENAI_API_KEY` = `your_openai_api_key_here`
   - Make sure to select **Production**, **Preview**, and **Development** for both
   - Click **Save**

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

6. **Your site is live!** 🎉
   You'll get a URL like: `https://dads-golf-helper.vercel.app`

---

## Option 2: Railway (Also Great)

Railway is another excellent option for Node.js apps.

### Steps:

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select your repository**: `rajveer-gill/Dads-Golf-helper`
5. **Add Environment Variables**:
   - Click on your project → Variables
   - Add:
     - `OPENWEATHER_API_KEY` = `your_openweather_api_key_here`
     - `OPENAI_API_KEY` = `your_openai_api_key_here`
6. **Deploy** - Railway will automatically deploy
7. **Get your URL** - Railway provides a URL like: `https://your-app.railway.app`

---

## Option 3: Render

Render is another good option.

### Steps:

1. **Go to Render**: https://render.com
2. **Sign up/Login** with GitHub
3. **New** → **Web Service**
4. **Connect your GitHub repo**: `rajveer-gill/Dads-Golf-helper`
5. **Configure**:
   - Name: `golf-helper` (or your choice)
   - Environment: **Node**
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. **Add Environment Variables**:
   - Scroll down to Environment Variables
   - Add:
     - `OPENWEATHER_API_KEY` = `your_openweather_api_key_here`
     - `OPENAI_API_KEY` = `your_openai_api_key_here`
7. **Create Web Service**
8. **Your site is live!** 🎉

---

## Important Notes

- **HTTPS Required**: All these platforms provide HTTPS automatically, which is required for:
  - Geolocation API (location services)
  - Device orientation (compass)
  - Camera access

- **Free Tiers**: All three platforms offer free tiers that should be sufficient for personal use

- **Custom Domain**: You can add a custom domain later if you want (e.g., `golfhelper.com`)

- **API Keys**: Never commit your API keys to GitHub! They should only be in environment variables on the hosting platform.

---

## Quick Deploy (Vercel - Fastest)

If you want the fastest deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add env vars in Vercel dashboard, then:
vercel --prod
```

That's it! Your site will be live in under 5 minutes. ⛳

