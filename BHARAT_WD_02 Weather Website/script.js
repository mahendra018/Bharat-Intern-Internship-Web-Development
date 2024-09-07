document.getElementById('search-btn').addEventListener('click', fetchWeather);

async function fetchWeather() {
    const city = document.getElementById('city-input').value;
    const apiKey = '87faea69fa4f491657aff2c048069129'; // Replace with your actual API key
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const currentResponse = await fetch(currentWeatherUrl);
        const currentData = await currentResponse.json();
        
        if (currentData.cod === '404') {
            document.getElementById('weather-info').style.display = 'none';
            document.getElementById('forecast-info').style.display = 'none';
            document.getElementById('not-found-icon').style.display = 'block';
            return;
        }

        document.getElementById('not-found-icon').style.display = 'none';
        document.getElementById('city-name').innerText = currentData.name;
        document.getElementById('temperature').innerText = `${Math.round(currentData.main.temp)}°C`;
        document.getElementById('description').innerText = currentData.weather[0].description;

        // Update icon based on weather condition
        const weatherIcon = document.getElementById('weather-icon');
        const condition = getWeatherCondition(currentData.weather[0].main, currentData.main.temp);
        weatherIcon.src = `icons/${condition}.png`;

        // Display weather info
        document.querySelector('.weather-info').style.display = 'block';

        // Fetch 3-day forecast data
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Display 3-day forecast
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = ''; // Clear previous forecast

        forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 3).forEach((item) => {
            const forecastBox = document.createElement('div');
            forecastBox.className = 'forecast-box';
            const forecastCondition = getWeatherCondition(item.weather[0].main, item.main.temp);
            forecastBox.innerHTML = `
                <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
                <p>${Math.round(item.main.temp)}°C</p>
                <img class="forecast-icon" src="icons/${forecastCondition}.png" alt="Weather Icon">
            `;
            forecastContainer.appendChild(forecastBox);
        });

        document.querySelector('.forecast-info').style.display = 'block';
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Determine the weather condition based on the weather description and temperature
function getWeatherCondition(main, temp) {
    switch (main) {
        case 'Clear':
            return temp > 25 ? 'bright-sun' : 'sun-cloud'; // Use temperature for warm vs mild conditions
        case 'Clouds':
            return temp > 20 ? 'light-cloud' : 'cool-breeze';
        case 'Rain':
            return 'raincloud';
        case 'Snow':
            return 'snowflake';
        case 'Thunderstorm':
            return 'storm-cloud';
        case 'Drizzle':
            return 'light-snowflake'; // or a specific drizzle icon
        case 'Fog':
            return 'fog-cloud';
        default:
            return 'default-icon'; // Fallback icon
    }
}
