const API_KEY = 'b7d2e9ea0d6559490a94fd7d7b4381df';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Constructor Function
function WeatherApp() {
    // Store DOM references
    this.weatherDisplay = document.getElementById('weather-display');
    this.cityInput = document.querySelector('.search-section #city-input');
    this.searchButton = document.getElementById('search-btn');
    this.statusMessage = document.getElementById('status-message');
    this.unitButtons = document.querySelectorAll('.unit-btn');
    this.cityChips = document.querySelectorAll('.city-chip');

    // App state
    this.unit = 'metric';
    this.lastCity = 'London';
}

const weatherDisplay = document.getElementById('weather-display');
const cityInput = document.querySelector('.search-section #city-input');
const searchButton = document.getElementById('search-btn');
const statusMessage = document.getElementById('status-message');
const unitButtons = document.querySelectorAll('.unit-btn');
const cityChips = document.querySelectorAll('.city-chip');
const recentSearchesSection = document.getElementById('recent-searches-section');
const recentSearchesList = document.getElementById('recent-searches-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

const RECENT_SEARCHES_KEY = 'recentSearches';
const LAST_CITY_KEY = 'lastCity';
const MAX_RECENT_SEARCHES = 5;

const appState = {
    unit: 'metric',
    lastCity: ''
};

function capitalizeWords(str) {
    return str.replace(/\w\S*/g, function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}

function loadRecentSearches() {
    try {
        return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveRecentSearch(city) {
    const formattedCity = capitalizeWords(city);
    let searches = loadRecentSearches();

    searches = searches.filter(function(c) {
        return c.toLowerCase() !== formattedCity.toLowerCase();
    });
    searches.unshift(formattedCity);

    if (searches.length > MAX_RECENT_SEARCHES) {
        searches = searches.slice(0, MAX_RECENT_SEARCHES);
    }

    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    localStorage.setItem(LAST_CITY_KEY, formattedCity);
    appState.lastCity = formattedCity;
    displayRecentSearches(searches);
}

function displayRecentSearches(searches) {
    if (!searches) {
        searches = loadRecentSearches();
    }

    if (searches.length === 0) {
        recentSearchesSection.classList.remove('visible');
        recentSearchesList.innerHTML = '';
        return;
    }

    recentSearchesSection.classList.add('visible');
    recentSearchesList.innerHTML = '';

    searches.forEach(function(city) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'recent-search-btn';
        btn.textContent = city;
        btn.addEventListener('click', function() {
            cityInput.value = city;
            getWeather(city);
        });
        recentSearchesList.appendChild(btn);
    });
}

function clearHistory() {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    localStorage.removeItem(LAST_CITY_KEY);
    appState.lastCity = '';
    displayRecentSearches([]);
}

function loadLastCity() {
    const lastCity = localStorage.getItem(LAST_CITY_KEY);
    if (lastCity) {
        appState.lastCity = lastCity;
        getWeather(lastCity);
    } else {
        weatherDisplay.innerHTML = `
            <div class="welcome-message">
                <p class="welcome-emoji">🌤️</p>
                <h3>Welcome to SkyFetch</h3>
                <p>Enter a city name to get started!</p>
            </div>
        `;
    }
}

function formatTime(unixSeconds) {
    return new Date(unixSeconds * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}

    this.unitButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            if (button.dataset.unit === this.unit) {
                return;
            }

            this.unit = button.dataset.unit;

            this.unitButtons.forEach(function(unitButton) {
                unitButton.classList.toggle('active', unitButton.dataset.unit === this.unit);
            }.bind(this));

            this.getWeather(this.lastCity);
        }.bind(this));
    }.bind(this));

    this.showWelcome();
};

// Show welcome message
WeatherApp.prototype.showWelcome = function() {
    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            <p class="welcome-emoji">🌤️</p>
            <h3>Welcome to SkyFetch</h3>
            <p>Enter a city name to get started!</p>
        </div>
    `;
};

// Handle search input
WeatherApp.prototype.handleSearch = function() {
    const city = this.cityInput.value.trim();

    if (!city) {
        const message = 'Please enter a city name.';
        this.setStatus(message, 'error');
        this.showError(message);
        this.cityInput.focus();
        return;
    }

    if (city.length < 2) {
        const message = 'City name too short. Please enter at least 2 characters.';
        this.setStatus(message, 'error');
        this.showError(message);
        this.cityInput.focus();
        this.cityInput.select();
        return;
    }

    if (this.searchButton.disabled) {
        return;
    }

    this.getWeather(city);
    this.cityInput.value = '';
};

// Fetch current weather and forecast simultaneously
WeatherApp.prototype.getWeather = async function(city) {
    const normalizedCity = city.trim();

    if (!normalizedCity) {
        const message = 'Please enter a city name.';
        this.setStatus(message, 'error');
        this.showError(message);
        return;
    }

    if (normalizedCity.length < 2) {
        const message = 'City name too short. Please enter at least 2 characters.';
        this.setStatus(message, 'error');
        this.showError(message);
        return;
    }

    this.setLoading(true);
    this.setStatus('', null);
    this.showLoading();

    const weatherUrl = `${API_URL}?q=${encodeURIComponent(normalizedCity)}&appid=${API_KEY}&units=${this.unit}`;
    const forecastUrl = `${FORECAST_URL}?q=${encodeURIComponent(normalizedCity)}&appid=${API_KEY}&units=${this.unit}`;

        console.log('Weather Data:', response.data);
        displayWeather(response.data);
        saveRecentSearch(response.data.name);
        setStatus(`Weather updated for ${response.data.name}.`, 'success');
    } catch (error) {
        console.error('Error fetching weather:', error);
        if (error.response && error.response.status === 404) {
            const message = 'City not found. Check spelling and try again.';
            this.setStatus(message, 'error');
            this.showError(message);
            return;
        }

        if (error.code === 'ECONNABORTED') {
            const message = 'Request timed out. Please check your connection.';
            this.setStatus(message, 'error');
            this.showError(message);
            return;
        }

        const message = 'Unable to fetch weather right now. Please try again shortly.';
        this.setStatus(message, 'error');
        this.showError(message);
    } finally {
        this.setLoading(false);
    }
};

// Display current weather
WeatherApp.prototype.displayWeather = function(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const sunrise = this.formatTime(data.sys.sunrise);
    const sunset = this.formatTime(data.sys.sunset);

    const speedUnit = this.unit === 'metric' ? 'm/s' : 'mph';
    const tempUnit = this.unit === 'metric' ? 'C' : 'F';
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

    this.weatherDisplay.innerHTML = weatherHTML;
    this.cityInput.focus();
};

// Process forecast data: filter to one entry per day at noon, with fallback to first entry per day
WeatherApp.prototype.processForecastData = function(data) {
    const dailyForecasts = data.list.filter(function(item) {
        return item.dt_txt.includes('12:00:00');
    });

    // Fallback: if noon entries are missing, pick the first entry for each unique date
    if (dailyForecasts.length < 5) {
        const seenDates = {};
        const fallback = data.list.filter(function(item) {
            const date = item.dt_txt.split(' ')[0];
            if (!seenDates[date]) {
                seenDates[date] = true;
                return true;
            }
            return false;
        });
        return fallback.slice(0, 5);
    }

    return dailyForecasts.slice(0, 5);
};

// Display 5-day forecast cards
WeatherApp.prototype.displayForecast = function(data) {
    const forecasts = this.processForecastData(data);
    const tempUnit = this.unit === 'metric' ? 'C' : 'F';

    const forecastCardsHTML = forecasts.map(function(item) {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(item.main.temp);
        const description = item.weather[0].description;
        const icon = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        return `
            <div class="forecast-card">
                <p class="forecast-day">${dayName}</p>
                <img src="${iconUrl}" alt="${description}" class="forecast-icon">
                <p class="forecast-temp">${temp}°${tempUnit}</p>
                <p class="forecast-description">${description}</p>
            </div>
        `;
    }).join('');

    const forecastHTML = `
        <div class="forecast-section">
            <h3 class="forecast-title">5-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastCardsHTML}
            </div>
        </div>
    `;

    this.weatherDisplay.innerHTML += forecastHTML;
};

// Show loading state
WeatherApp.prototype.showLoading = function() {
    const loadingHTML = `
        <div class="loading-container" role="status" aria-live="polite">
            <div class="loading-spinner" aria-hidden="true"></div>
            <p class="loading-text">Loading weather data...</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = loadingHTML;
};

// Show error message
WeatherApp.prototype.showError = function(message) {
    const errorHTML = `
        <div class="error-message" role="alert" aria-live="assertive">
            <p class="error-icon">⚠️</p>
            <h3 class="error-title">Weather Lookup Failed</h3>
            <p class="error-text">${message}</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = errorHTML;
};

// Set loading state on search button
WeatherApp.prototype.setLoading = function(isLoading) {
    if (this.searchButton) {
        this.searchButton.disabled = isLoading;
        this.searchButton.textContent = isLoading ? 'Searching...' : 'Search';
    }
};

// Update status message
WeatherApp.prototype.setStatus = function(message, type) {
    this.statusMessage.textContent = message;
    this.statusMessage.className = 'status-message';

        if (appState.lastCity) {
            getWeather(appState.lastCity);
        }
    });
});

clearHistoryBtn.addEventListener('click', clearHistory);

displayRecentSearches();
loadLastCity();

