# SkyFetch Weather Dashboard

A professional weather dashboard built with HTML, CSS, and JavaScript using the OpenWeatherMap API.

## Features

- Search weather by city name
- Quick city shortcuts (London, Paris, New York, Tokyo)
- Temperature unit toggle (Celsius / Fahrenheit)
- Detailed weather display:
  - City name and weather icon
  - Current temperature and description
  - Feels like, humidity, and wind speed
  - Sunrise and sunset times
- **Recent searches** saved in localStorage (up to 5, clickable pills)
- **Auto-load** last searched city on page refresh
- **Clear history** button to reset saved searches
- User-friendly loading and error states

## Concepts Applied

- JavaScript APIs
- Axios HTTP client
- Async / Await
- DOM manipulation
- localStorage for data persistence
- JSON.stringify() / JSON.parse()
- Array manipulation (duplicate removal, max-size limiting)

## Run

1. Open `index.html` in your browser.
2. Enter a city and click **Search** (or press Enter).
3. Switch between `°C` and `°F` using the unit toggle.
4. Click any recent search pill to reload that city's weather.
5. Refresh the page — the last searched city loads automatically.

## Test Cities

- London
- Paris
- New York
- Tokyo
