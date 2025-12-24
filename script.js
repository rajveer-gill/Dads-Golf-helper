// API endpoints - keys are stored securely on the server
const API_BASE_URL = window.location.origin;

// Global state
let currentLocation = null;
let currentDirection = null;
let uploadedImage = null;
let weatherData = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('golfForm');
    const getLocationBtn = document.getElementById('getLocationBtn');
    const getDirectionBtn = document.getElementById('getDirectionBtn');
    const imageUpload = document.getElementById('imageUpload');
    const submitBtn = document.getElementById('submitBtn');

    // Get location button
    getLocationBtn.addEventListener('click', getCurrentLocation);

    // Get direction button
    getDirectionBtn.addEventListener('click', getCurrentDirection);

    // Image upload
    imageUpload.addEventListener('change', handleImageUpload);

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Check if we can enable submit button
    checkSubmitButton();
});

// Get current location using Geolocation API
function getCurrentLocation() {
    const statusDiv = document.getElementById('locationStatus');
    statusDiv.textContent = 'Getting location...';
    statusDiv.className = 'status info';

    if (!navigator.geolocation) {
        statusDiv.textContent = 'Geolocation is not supported by your browser.';
        statusDiv.className = 'status error';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            currentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            statusDiv.textContent = `Location found! (${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)})`;
            statusDiv.className = 'status success';

            // Fetch weather data
            await fetchWeatherData(currentLocation.latitude, currentLocation.longitude);
            checkSubmitButton();
        },
        (error) => {
            let errorMsg = 'Error getting location: ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Permission denied. Please enable location access.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'Position unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMsg += 'Request timeout.';
                    break;
                default:
                    errorMsg += 'Unknown error.';
                    break;
            }
            statusDiv.textContent = errorMsg;
            statusDiv.className = 'status error';
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Get current direction using Device Orientation API
function getCurrentDirection() {
    const statusDiv = document.getElementById('directionStatus');
    
    if (!window.DeviceOrientationEvent) {
        statusDiv.textContent = 'Device orientation is not supported by your browser.';
        statusDiv.className = 'status error';
        return;
    }

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ requires permission
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    startCompass();
                } else {
                    statusDiv.textContent = 'Permission denied for device orientation.';
                    statusDiv.className = 'status error';
                }
            })
            .catch(error => {
                statusDiv.textContent = 'Error requesting orientation permission.';
                statusDiv.className = 'status error';
            });
    } else {
        startCompass();
    }

    function startCompass() {
        statusDiv.textContent = 'Point your device toward your target and wait...';
        statusDiv.className = 'status info';

        let alpha = null;
        let count = 0;

        const orientationHandler = (event) => {
            if (event.alpha !== null) {
                alpha = event.alpha;
                count++;
                
                // Wait for a few readings to stabilize
                if (count >= 5) {
                    currentDirection = alpha;
                    const directionName = getDirectionName(alpha);
                    statusDiv.textContent = `Direction: ${directionName} (${Math.round(alpha)}°)`;
                    statusDiv.className = 'status success';
                    window.removeEventListener('deviceorientation', orientationHandler);
                    checkSubmitButton();
                }
            }
        };

        window.addEventListener('deviceorientation', orientationHandler);
    }
}

// Convert degrees to direction name
function getDirectionName(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage = e.target.result;
            preview.innerHTML = `<img src="${uploadedImage}" alt="Target area">`;
            preview.style.display = 'block';
            checkSubmitButton();
        };
        reader.readAsDataURL(file);
    } else {
        uploadedImage = null;
        preview.style.display = 'none';
        checkSubmitButton();
    }
}

// Fetch weather data from backend API
async function fetchWeatherData(lat, lon) {
    try {
        const url = `${API_BASE_URL}/api/weather?lat=${lat}&lon=${lon}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Weather API request failed');
        }

        weatherData = await response.json();
        displayWeatherData(weatherData);
    } catch (error) {
        console.error('Error fetching weather:', error);
        const weatherCard = document.getElementById('weatherCard');
        weatherCard.style.display = 'none';
        const statusDiv = document.getElementById('locationStatus');
        statusDiv.textContent = `Location found, but weather unavailable: ${error.message}`;
        statusDiv.className = 'status error';
    }
}

// Display weather data
function displayWeatherData(data) {
    const weatherCard = document.getElementById('weatherCard');
    const weatherInfo = document.getElementById('weatherInfo');

    const windSpeed = data.wind?.speed || 0;
    const windDeg = data.wind?.deg || 0;
    const windDirection = getDirectionName(windDeg);
    const temperature = data.main?.temp || 'N/A';
    const humidity = data.main?.humidity || 'N/A';
    const conditions = data.weather?.[0]?.description || 'N/A';
    const pressure = data.main?.pressure || 'N/A';

    weatherInfo.innerHTML = `
        <div class="weather-item">
            <strong>Temperature</strong>
            <span>${Math.round(temperature)}°F</span>
        </div>
        <div class="weather-item">
            <strong>Wind Speed</strong>
            <span>${windSpeed.toFixed(1)} mph</span>
        </div>
        <div class="weather-item">
            <strong>Wind Direction</strong>
            <span>${windDirection} (${Math.round(windDeg)}°)</span>
        </div>
        <div class="weather-item">
            <strong>Humidity</strong>
            <span>${humidity}%</span>
        </div>
        <div class="weather-item">
            <strong>Conditions</strong>
            <span>${conditions.charAt(0).toUpperCase() + conditions.slice(1)}</span>
        </div>
        <div class="weather-item">
            <strong>Pressure</strong>
            <span>${pressure} hPa</span>
        </div>
    `;

    weatherCard.style.display = 'block';
}

// Check if submit button should be enabled
function checkSubmitButton() {
    const distance = document.getElementById('distance').value;
    const submitBtn = document.getElementById('submitBtn');
    
    // Enable if distance is entered (other fields are optional)
    submitBtn.disabled = !distance || distance <= 0;
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const distance = document.getElementById('distance').value;
    const adviceCard = document.getElementById('adviceCard');
    const adviceContent = document.getElementById('adviceContent');

    // Show loading state
    adviceCard.style.display = 'block';
    adviceContent.innerHTML = '<div class="spinner"></div><p style="margin-top: 15px;">Getting your personalized golf advice...</p>';
    adviceContent.className = 'loading';

    try {
        const advice = await getGolfAdvice(distance, uploadedImage, currentLocation, currentDirection, weatherData);
        // Render markdown to HTML
        if (typeof marked !== 'undefined') {
            adviceContent.innerHTML = marked.parse(advice);
        } else {
            // Fallback: simple markdown-like formatting
            adviceContent.innerHTML = formatMarkdown(advice);
        }
        adviceContent.className = '';
    } catch (error) {
        adviceContent.innerHTML = `Error: ${error.message}. Please make sure the server is running and your API keys are configured in the .env file.`;
        adviceContent.className = '';
    }
}

// Get golf advice from backend API
async function getGolfAdvice(distance, image, location, direction, weather) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/golf-advice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                distance: parseInt(distance),
                location: location,
                direction: direction,
                weather: weather,
                image: image
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get golf advice');
        }

        const data = await response.json();
        return data.advice;
    } catch (error) {
        throw error;
    }
}

// Simple markdown formatter (fallback if marked.js doesn't load)
function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>')
        .replace(/^[-*]\s+(.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.*)$/, '<p>$1</p>');
}

// Add input listener for distance field
document.addEventListener('DOMContentLoaded', () => {
    const distanceInput = document.getElementById('distance');
    if (distanceInput) {
        distanceInput.addEventListener('input', checkSubmitButton);
    }
});

