const API_KEY = 'b7d2e9ea0d6559490a94fd7d7b4381df';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const weatherDisplay = document.getElementById('weather-display');
const cityInput = document.querySelector('.search-section #city-input');
const searchButton = document.getElementById('search-btn');
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

function showLoading() {
    const loadingHTML = `
        <div class="loading-container" role="status" aria-live="polite">
            <div class="loading-spinner" aria-hidden="true"></div>
            <p class="loading-text">Loading weather data...</p>
        </div>
    `;

    weatherDisplay.innerHTML = loadingHTML;
}

function setLoading(isLoading) {
    if (searchButton) {
        searchButton.disabled = isLoading;
        searchButton.textContent = isLoading ? 'Searching...' : 'Search';
    }
}

function showError(message) {
    const errorHTML = `
        <div class="error-message" role="alert" aria-live="assertive">
            <p class="error-icon">⚠️</p>
            <h3 class="error-title">Weather Lookup Failed</h3>
            <p class="error-text">${message}</p>
        </div>
    `;

    weatherDisplay.innerHTML = errorHTML;
}

async function getWeather(city) {
    const normalizedCity = city.trim();

    if (!normalizedCity) {
        const message = 'Please enter a city name.';
        setStatus(message, 'error');
        showError(message);
        return;
    }

    if (normalizedCity.length < 2) {
        const message = 'City name too short. Please enter at least 2 characters.';
        setStatus(message, 'error');
        showError(message);
        return;
    }

    setLoading(true);
    setStatus('', null);
    showLoading();
    const url = `${API_URL}?q=${encodeURIComponent(normalizedCity)}&appid=${API_KEY}&units=${appState.unit}`;

    try {
        const response = await axios.get(url, { timeout: 8000 });

        console.log('Weather Data:', response.data);
        displayWeather(response.data);
        appState.lastCity = response.data.name;
        setStatus(`Weather updated for ${response.data.name}.`, 'success');
    } catch (error) {
        console.error('Error fetching weather:', error);
        if (error.response && error.response.status === 404) {
            const message = 'City not found. Check spelling and try again.';
            setStatus(message, 'error');
            showError(message);
            return;
        }

        if (error.code === 'ECONNABORTED') {
            const message = 'Request timed out. Please check your connection.';
            setStatus(message, 'error');
            showError(message);
            return;
        }

        const message = 'Unable to fetch weather right now. Please try again shortly.';
        setStatus(message, 'error');
        showError(message);
    } finally {
        setLoading(false);
    }
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
    cityInput.focus();
}

function handleSearch() {
    const city = cityInput.value.trim();

    if (!city) {
        const message = 'Please enter a city name.';
        setStatus(message, 'error');
        showError(message);
        cityInput.focus();
        return;
    }

    if (city.length < 2) {
        const message = 'City name too short. Please enter at least 2 characters.';
        setStatus(message, 'error');
        showError(message);
        cityInput.focus();
        cityInput.select();
        return;
    }

    if (searchButton.disabled) {
        return;
    }

    getWeather(city);
    cityInput.value = '';
}

searchButton.addEventListener('click', handleSearch);

cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
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

weatherDisplay.innerHTML = `
    <div class="welcome-message">
        <p class="welcome-emoji">🌤️</p>
        <h3>Welcome to SkyFetch</h3>
        <p>Enter a city name to get started!</p>
    </div>
`;
