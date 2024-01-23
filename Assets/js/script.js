document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event triggered');

    let searchButton = document.getElementById('search-button');
    let searchInput = document.getElementById('search-input');
    const currentCity = document.getElementById('current-city');
    const recentSearchContainer = document.getElementById('recent-search-container');
    const maxRecentSearches = 10;
    let weatherData; // Define weatherData globally to make it accessible across functions

    function displayCurrentCity(city, state, country) {
        const stateText = state ? `${state} ` : '';
        const countryText = country ? `${country}` : '';
        currentCity.textContent = `${city} ${stateText}${countryText}`;
    }

    function insertCurrentWeather(temperatureFahrenheit, wind, humidity) {
        const currentWeatherList = document.getElementById('current-city-forecast');
        currentWeatherList.textContent = ''; // Clear existing content

        appendWeatherItem(currentWeatherList, 'Temperature', `${temperatureFahrenheit}°F`);
        appendWeatherItem(currentWeatherList, 'Wind', `${wind} m/s`);
        appendWeatherItem(currentWeatherList, 'Humidity', `${humidity}%`);

        updateFiveDayForecast(weatherData); // Pass weatherData here
    }

    function updateFiveDayForecast(weatherData) {
        const forecastContainers = [
            document.getElementById('one-day-out-forecast'),
            document.getElementById('two-days-out-forecast'),
            document.getElementById('three-days-out-forecast'),
            document.getElementById('four-days-out-forecast'),
            document.getElementById('five-days-out-forecast')
        ];

        // Assuming weatherData is an array containing 5-day forecast data
        if (weatherData && weatherData.list) {
            for (let i = 0; i < 5; i++) {
                const forecastIndex = i * 8;
                const temperatureKelvin = weatherData.list[forecastIndex].main.temp;
                const temperatureFahrenheit = Math.round((temperatureKelvin - 273.15) * 9/5 + 32);
                const wind = weatherData.list[forecastIndex].wind.speed;
                const humidity = weatherData.list[forecastIndex].main.humidity;

                const forecastContainer = forecastContainers[i];
                forecastContainer.textContent = ''; // Clear existing content

                appendWeatherItem(forecastContainer, 'Temperature', `${temperatureFahrenheit}°F`);
                appendWeatherItem(forecastContainer, 'Wind', `${wind} m/s`);
                appendWeatherItem(forecastContainer, 'Humidity', `${humidity}%`);
            }
        } else {
            console.error('Invalid or missing weather data.');
        }
    }

    function appendWeatherItem(container, label, value) {
        const listItem = document.createElement('li');
        listItem.textContent = `${label}: ${value}`;
        container.appendChild(listItem);
    }

    function updateRecentSearches() {
        const recentSearches = getRecentSearches();
        recentSearchContainer.textContent = '';
        for (const search of recentSearches) {
            const listItem = document.createElement('li');
            listItem.textContent = search;
            recentSearchContainer.appendChild(listItem);
        }
    }

    updateRecentSearches(); // Display initial recent searches

    searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        console.log('Search button clicked');
        const searchArray = splitSearch();
        console.log('Search Array:', searchArray);

        const city = searchArray[0];
        const state = searchArray[1];
        const country = searchArray[2];

        let geocodingAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=7b1eab3296911715f248b7a79b72ba34`;

        fetch(geocodingAPI)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const latitude = data[0].lat;
                    const longitude = data[0].lon;

                    console.log('Latitude:', latitude);
                    console.log('Longitude:', longitude);

                    let weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=7b1eab3296911715f248b7a79b72ba34`;

                    fetch(weatherAPI)
                        .then(response => response.json())
                        .then(weatherDataResponse => {
                            weatherData = weatherDataResponse; // Assign the response to weatherData
                            const temperatureKelvin = weatherData.list[0].main.temp;
                            const temperatureFahrenheit = Math.round((temperatureKelvin - 273.15) * 9/5 + 32);
                            const currentWind = weatherData.list[0].wind.speed;
                            const currentHumidity = weatherData.list[0].main.humidity;

                            console.log('Temperature in Fahrenheit:', temperatureFahrenheit);

                            insertCurrentWeather(temperatureFahrenheit, currentWind, currentHumidity);
                        })
                        .catch(error => {
                            console.error('Error fetching weather data:', error);
                        });
                } else {
                    console.error('No geocoding data found for the given city and country.');
                }
            })
            .catch(error => {
                console.error('Error fetching geocoding data:', error);
            });

        storeSearchInput(searchArray);
        displayCurrentCity(city, state, country);
        updateRecentSearches();
    });

    function splitSearch() {
        return searchInput.value.split(' ');
    }

    function storeSearchInput(searchArray) {
        const recentSearches = getRecentSearches();
        recentSearches.unshift(searchArray.join(' '));
        const trimmedSearches = recentSearches.slice(0, maxRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(trimmedSearches));
    }

    function getRecentSearches() {
        const storedSearches = localStorage.getItem('recentSearches');
        return storedSearches ? JSON.parse(storedSearches) : [];
    }
});












