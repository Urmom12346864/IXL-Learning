// Weather Dashboard JavaScript
const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Get DOM elements
const searchInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');

// Event listeners
searchButton.addEventListener('click', searchWeather);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Fetch weather data
async function fetchWeatherData(city) {
    try {
        loadingMessage.classList.add('show');
        errorMessage.classList.remove('show');
        weatherContainer.innerHTML = '';

        const response = await fetch(
            `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        loadingMessage.classList.remove('show');
        displayWeather(data);
    } catch (error) {
        loadingMessage.classList.remove('show');
        showError(error.message);
    }
}

// Display weather information
function displayWeather(data) {
    const { name, main, weather, wind, clouds, sys } = data;
    
    const weatherHTML = `
        <div class="weather-header">
            <div>
                <h2 class="location">${name}, ${data.sys.country}</h2>
                <p class="weather-description">${weather[0].description}</p>
            </div>
            <div class="weather-icon">${getWeatherIcon(weather[0].main)}</div>
        </div>

        <div class="temperature">${Math.round(main.temp)}°C</div>

        <div class="weather-details">
            <div class="detail">
                <div class="detail-label">Feels Like</div>
                <div class="detail-value">${Math.round(main.feels_like)}°C</div>
            </div>
            <div class="detail">
                <div class="detail-label">Humidity</div>
                <div class="detail-value">${main.humidity}%</div>
            </div>
            <div class="detail">
                <div class="detail-label">Pressure</div>
                <div class="detail-value">${main.pressure} hPa</div>
            </div>
            <div class="detail">
                <div class="detail-label">Wind Speed</div>
                <div class="detail-value">${wind.speed} m/s</div>
            </div>
            <div class="detail">
                <div class="detail-label">Cloudiness</div>
                <div class="detail-value">${clouds.all}%</div>
            </div>
            <div class="detail">
                <div class="detail-label">UV Index</div>
                <div class="detail-value">N/A</div>
            </div>
        </div>
    `;

    weatherContainer.innerHTML = weatherHTML;
}

// Get weather emoji icon
function getWeatherIcon(weatherType) {
    const icons = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '💨',
        'Haze': '🌫️',
        'Dust': '🌪️',
        'Fog': '🌫️',
        'Sand': '🌪️',
        'Ash': '🌋',
        'Squall': '🌪️',
        'Tornado': '🌪️'
    };
    return icons[weatherType] || '🌤️';
}

// Show error message
function showError(message) {
    errorMessage.textContent = `Error: ${message}`;
    errorMessage.classList.add('show');
}

// Search weather
function searchWeather() {
    const city = searchInput.value.trim();
    if (city) {
        fetchWeatherData(city);
        searchInput.value = '';
    }
}

// Load default city on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData('London');
});
