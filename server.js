const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Load .env file explicitly from current directory
const envResult = dotenv.config({ path: path.join(__dirname, '.env') });
if (envResult.error) {
    console.warn('Warning: Could not load .env file:', envResult.error.message);
} else {
    console.log('✓ .env file loaded successfully');
}

// Debug: Log environment variables on startup
console.log('Environment check:');
console.log('OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY ? `Found (${process.env.OPENWEATHER_API_KEY.substring(0, 10)}...)` : 'NOT FOUND');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? `Found (${process.env.OPENAI_API_KEY.substring(0, 10)}...)` : 'NOT FOUND');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Weather API proxy endpoint
app.get('/api/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
        return res.status(500).json({ error: 'OpenWeather API key not configured' });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData.message || 'Weather API request failed' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// OpenAI API proxy endpoint
app.post('/api/golf-advice', async (req, res) => {
    const { distance, location, direction, weather, image } = req.body;

    if (!distance) {
        return res.status(400).json({ error: 'Distance is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    try {
        // Build the prompt
        let prompt = `You are an expert golf caddy providing advice to a golfer. Here's the situation:\n\n`;
        prompt += `- Distance from hole: ${distance} yards\n`;

        if (location) {
            prompt += `- Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}\n`;
        }

        if (direction !== null && direction !== undefined) {
            const directionName = getDirectionName(direction);
            prompt += `- Facing direction: ${directionName} (${Math.round(direction)}°)\n`;
        }

        if (weather) {
            const windSpeed = weather.wind?.speed || 0;
            const windDeg = weather.wind?.deg || 0;
            const windDirection = getDirectionName(windDeg);
            const temperature = weather.main?.temp || 'N/A';
            const humidity = weather.main?.humidity || 'N/A';
            const conditions = weather.weather?.[0]?.description || 'N/A';
            
            prompt += `- Weather conditions:\n`;
            prompt += `  * Temperature: ${Math.round(temperature)}°F\n`;
            prompt += `  * Wind: ${windSpeed.toFixed(1)} mph from ${windDirection} (${Math.round(windDeg)}°)\n`;
            prompt += `  * Humidity: ${humidity}%\n`;
            prompt += `  * Conditions: ${conditions}\n`;
        }

        if (image) {
            prompt += `- The golfer has uploaded a picture of the target area.\n`;
        }

        prompt += `\nPlease provide specific, actionable golf advice including:\n`;
        prompt += `1. Club selection recommendation\n`;
        prompt += `2. How to account for wind conditions\n`;
        prompt += `3. Shot strategy and technique tips\n`;
        prompt += `4. Any other relevant factors to consider\n`;
        prompt += `\nBe concise but helpful, and write in a friendly, encouraging tone.`;

        // Prepare messages for OpenAI
        const messages = [
            {
                role: 'system',
                content: 'You are an expert golf caddy with years of experience helping golfers improve their game. Provide practical, actionable advice.'
            },
            {
                role: 'user',
                content: image ? [
                    { type: 'text', text: prompt },
                    {
                        type: 'image_url',
                        image_url: {
                            url: image
                        }
                    }
                ] : prompt
            }
        ];

        const requestBody = {
            model: image ? 'gpt-4o' : 'gpt-4o-mini',
            messages: messages,
            max_tokens: 500,
            temperature: 0.7
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData.error?.message || 'OpenAI API request failed' });
        }

        const data = await response.json();
        res.json({ advice: data.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: 'Failed to get golf advice' });
    }
});

// Helper function to convert degrees to direction name
function getDirectionName(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Serve static files explicitly
app.use(express.static(__dirname, {
    maxAge: '1d',
    etag: true
}));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server (only if not in Vercel/serverless environment)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`⛳ Golf Helper server running on http://localhost:${PORT}`);
        console.log(`📝 Make sure your .env file has your API keys configured!`);
    });
}

// Export for Vercel/serverless
module.exports = app;

