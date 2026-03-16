const API_KEY = 'b7d2e9ea0d6559490a94fd7d7b4381df';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const weatherDisplay = document.getElementById('weather-display');
const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const statusMessage = document.getElementById('status-message');
const unitButtons = document.querySelectorAll('.unit-btn');
const cityChips = document.querySelectorAll('.city-chip');

const appState = {
    unit: 'metric',
    lastCity: 'London'
};

function formatTime(unixSeconds) {
    return new Date(unixSeconds * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function setStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message';

    if (type === 'success') {
        statusMessage.classList.add('success');
    }

    if (type === 'error') {
        statusMessage.classList.add('error');
    }
}

function setLoading(isLoading) {
    searchButton.disabled = isLoading;
    searchButton.textContent = isLoading ? 'Searching...' : 'Search';

    if (isLoading) {
        weatherDisplay.innerHTML = '<p class="loading">Loading weather data...</p>';
    }
}

function getWeather(city) {
    setLoading(true);
    setStatus('', null);

    axios.get(API_URL, {
        params: {
            q: city,
            appid: API_KEY,
            units: appState.unit
        },
        timeout: 8000
    })
        .then(function(response) {
            console.log('Weather Data:', response.data);
            displayWeather(response.data);
            appState.lastCity = response.data.name;
            setStatus(`Weather updated for ${response.data.name}.`, 'success');
        })
        .catch(function(error) {
            console.error('Error fetching weather:', error);
            weatherDisplay.innerHTML =
                '<p class="loading">Could not fetch weather data. Please try again.</p>';

            if (error.response && error.response.status === 404) {
                setStatus('City not found. Check spelling and try again.', 'error');
                return;
            }

            if (error.code === 'ECONNABORTED') {
                setStatus('Request timed out. Please check your connection.', 'error');
                return;
            }

            setStatus('Unable to fetch weather right now.', 'error');
        })
        .finally(function() {
            setLoading(false);
        });
}

function displayWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const sunrise = formatTime(data.sys.sunrise);
    const sunset = formatTime(data.sys.sunset);

    const speedUnit = appState.unit === 'metric' ? 'm/s' : 'mph';
    const tempUnit = appState.unit === 'metric' ? 'C' : 'F';
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°${tempUnit}</div>
            <p class="description">${description}</p>

            <div class="details-grid">
                <div class="detail-card">
                    <p class="detail-label">Feels Like</p>
                    <p class="detail-value">${feelsLike}°${tempUnit}</p>
                </div>
                <div class="detail-card">
                    <p class="detail-label">Humidity</p>
                    <p class="detail-value">${humidity}%</p>
                </div>
                <div class="detail-card">
                    <p class="detail-label">Wind</p>
                    <p class="detail-value">${windSpeed} ${speedUnit}</p>
                </div>
                <div class="detail-card">
                    <p class="detail-label">Sunrise / Sunset</p>
                    <p class="detail-value">${sunrise} / ${sunset}</p>
                </div>
            </div>
        </div>
    `;

    weatherDisplay.innerHTML = weatherHTML;
}

weatherForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        setStatus('Please enter a city name.', 'error');
        return;
    }

    getWeather(city);
});

cityChips.forEach(function(chip) {
    chip.addEventListener('click', function() {
        const city = chip.dataset.city;
        cityInput.value = city;
        getWeather(city);
    });
});

unitButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        if (button.dataset.unit === appState.unit) {
            return;
        }

        appState.unit = button.dataset.unit;

        unitButtons.forEach(function(unitButton) {
            unitButton.classList.toggle('active', unitButton.dataset.unit === appState.unit);
        });

        getWeather(appState.lastCity);
    });
});

getWeather('London');
