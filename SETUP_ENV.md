# Setting Up Your .env File

Since the `.env` file is protected (for security), you need to create it manually.

## Quick Setup

1. **Create the file**: In the project folder, create a new file named `.env` (with the dot at the beginning)

2. **Add your API keys**: Copy this template and fill in your keys:

```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Get OpenWeatherMap Key** (if you don't have it):
   - Go to https://openweathermap.org/api
   - Sign up for free
   - Get your API key
   - Replace `your_openweather_api_key_here` with your actual key

4. **Save the file** - Make sure it's named exactly `.env` (not `.env.txt` or anything else)

## File Location

The `.env` file should be in the same folder as `server.js`:
```
Dads-Golf-helper/
  ├── .env          ← Create this file here
  ├── server.js
  ├── index.html
  └── ...
```

## Security Note

⚠️ **Important**: The `.env` file is already in `.gitignore`, so it won't be committed to git. This keeps your API keys safe!

## Verify It Works

After creating the `.env` file, run:
```bash
npm start
```

If you see "Golf Helper server running on http://localhost:8000", you're all set! ✅

