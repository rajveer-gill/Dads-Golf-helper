# Quick Start Guide

## 5-Minute Setup

### Step 1: Get Your API Keys (5 minutes)

1. **OpenWeatherMap** (Free):
   - Visit: https://openweathermap.org/api
   - Sign up → Get your free API key
   - Copy the key

2. **OpenAI** (Paid, but very affordable):
   - Visit: https://platform.openai.com/api-keys
   - Sign up → Create API key
   - Copy the key (starts with `sk-`)
   - Add payment method (you'll only pay for what you use)

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create .env File

Create a file named `.env` in the project folder and add your keys:

```env
OPENWEATHER_API_KEY=paste-your-openweather-key-here
OPENAI_API_KEY=paste-your-openai-key-here
```

**Note**: Your OpenAI key is already added above! Just add your OpenWeatherMap key.

### Step 4: Run the App

```bash
npm start
```

Then open: http://localhost:8000

**That's it!** 🎉

## First Use Tips

1. **On Mobile**: Works best on your phone's browser (better GPS & compass)
2. **Permissions**: Allow location and device orientation when prompted
3. **Image Upload**: Take a photo directly from the golf course for best results
4. **Direction**: Point your phone toward your target when getting direction

## Cost Estimate

- **OpenWeatherMap**: Free (up to 60 calls/minute)
- **OpenAI**: ~$0.01-0.05 per advice request (very affordable!)

Enjoy your golf helper! ⛳

