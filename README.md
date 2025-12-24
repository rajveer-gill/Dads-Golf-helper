# ⛳ Golf Helper - Your Personal Caddy

A web application that helps golfers make better shots by providing personalized advice based on distance, location, weather conditions, wind direction, and target area images.

## Features

- 📏 **Distance Input**: Enter how far you are from the hole
- 📸 **Image Upload**: Upload a picture of where you're trying to hit
- 📍 **Location Detection**: Automatically gets your current location using GPS
- 🌤️ **Weather Data**: Fetches real-time weather and wind conditions
- 🧭 **Direction Detection**: Determines which direction you're facing
- 🤖 **AI-Powered Advice**: Uses OpenAI API to provide personalized golf recommendations

## Setup Instructions

### 1. Get API Keys

You'll need two API keys:

#### OpenWeatherMap API (Free)
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Copy your API key

#### OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy your API key (starts with `sk-`)

### 2. Install Dependencies

Make sure you have Node.js installed, then run:

```bash
npm install
```

This will install Express, dotenv, and CORS packages needed for the server.

### 3. Configure API Keys

1. Create a `.env` file in the project root (copy from `.env.example` if it exists)
2. Add your API keys to the `.env` file:

```env
OPENWEATHER_API_KEY=your-actual-openweather-api-key
OPENAI_API_KEY=your-actual-openai-api-key
```

**Important**: The `.env` file is already in `.gitignore` to keep your keys secure. Never commit this file to version control!

### 4. Run the Application

Start the server:

```bash
npm start
```

Or:

```bash
node server.js
```

The server will start on `http://localhost:8000` (or the port specified in your `.env` file as `PORT`).

Open your browser and go to: `http://localhost:8000`

### 4. Using the Application

1. **Enter Distance**: Type in how many yards you are from the hole
2. **Upload Image** (Optional): Take or upload a picture of your target area
3. **Get Location**: Click "Get My Location" to fetch your GPS coordinates and weather
4. **Get Direction** (Optional): Click "Get Direction I'm Facing" and point your device toward your target
5. **Get Advice**: Click "Get Golf Advice" to receive personalized recommendations

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (may require permission prompts)
- **Mobile Browsers**: Full support with proper permissions

## Permissions Required

- **Location**: Required for GPS coordinates and weather data
- **Device Orientation** (iOS): Required for compass/direction detection
- **Camera/File Access**: Required for image upload

## Notes

- The app works best on mobile devices where GPS and compass features are more accurate
- For iOS devices, you may need to grant permission for device orientation
- Weather data requires an active internet connection
- OpenAI API calls consume credits from your OpenAI account

## Troubleshooting

### Location not working?
- Make sure you've granted location permissions in your browser
- Try using HTTPS or localhost (some browsers block geolocation on HTTP)

### Direction not working?
- On iOS, you need to grant permission when prompted
- Make sure your device has a compass/magnetometer
- Try moving your device in a figure-8 motion to calibrate

### Weather data not showing?
- Check that your OpenWeatherMap API key is correct in the `.env` file
- Make sure the server is running
- Ensure you have an internet connection
- Free tier may have rate limits

### OpenAI advice not working?
- Verify your OpenAI API key is correct in the `.env` file
- Make sure the server is running (`npm start`)
- Check that you have credits in your OpenAI account
- Ensure you have internet connectivity
- Check the server console for error messages

## License

This is a personal project - feel free to modify and use as you wish!

## Made with ❤️

A Christmas gift for Dad!

