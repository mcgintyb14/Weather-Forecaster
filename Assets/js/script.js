document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event triggered');

    let searchButton = document.getElementById('search-button');
    let searchInput = document.getElementById('search-input');

    const currentCity = document.getElementById('current-city');
    const currentWeather = document.getElementById('current-city-forecast');
    const recentSearchContainer = document.getElementById('recent-search-container');
    const maxRecentSearches = 10;

    function displayCurrentCity(city, state, country) {
        // Check if state is defined before appending it to the currentCity element
        const stateText = state ? `${state} ` : '';
        const countryText = country ? `${country}` : '';
        currentCity.textContent = `${city} ${stateText}${countryText}`;
    }
    

    function insertCurrentWeather(temperatureFahrenheit, wind, humidity) {
        currentWeather.textContent = '';
        const temperatureLi = document.createElement('li');
        const roundedTemperature = Math.floor(temperatureFahrenheit);
        temperatureLi.textContent = `Temperature: ${roundedTemperature}°F`;

        const windLi = document.createElement('li');
        windLi.textContent = `Wind: ${wind} m/s`;

        const humidityLi = document.createElement('li');
        humidityLi.textContent = `Humidity: ${humidity}%`;

        currentWeather.appendChild(temperatureLi);
        currentWeather.appendChild(windLi);
        currentWeather.appendChild(humidityLi);
    }

    searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        console.log('Search button clicked');
        // Call the splitSearch function and log the result to the console
        const searchArray = splitSearch();
        console.log('Search Array:', searchArray);

        const city = searchArray[0];
        const state = searchArray[1];
        const country = searchArray[2];

        let geocodingAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=7b1eab3296911715f248b7a79b72ba34`;

        let currentWind, currentHumidity;

        fetch(geocodingAPI)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const latitude = data[0].lat;
                    const longitude = data[0].lon;

                    console.log('Latitude:', latitude);
                    console.log('Longitude:', longitude);

                    let weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=7b1eab3296911715f248b7a79b72ba34`;

                    return fetch(weatherAPI);
                } else {
                    console.error('No geocoding data found for the given city and country.');
                    return Promise.reject('No geocoding data found.');
                }
            })
            .then(response => response.json())
            .then(weatherData => {
                const temperatureKelvin = weatherData.list[0].main.temp;
                const temperatureFahrenheit = ((temperatureKelvin - 273.15) / 0.5556) + 32;
                currentWind = weatherData.list[0].wind.speed;
                currentHumidity = weatherData.list[0].main.humidity;

                console.log('Temperature in Fahrenheit:', temperatureFahrenheit);

                console.log(weatherData);

                insertCurrentWeather(temperatureFahrenheit, currentWind, currentHumidity);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // Store the search input to local storage
        storeSearchInput(searchArray);
        displayCurrentCity(city, state, country);
    });

    // Function to split the search input
    function splitSearch() {
        return searchInput.value.split(' ');
    }

    function storeSearchInput(searchArray) {
        // Convert the array to JSON and store it in local storage
        localStorage.setItem('searchHistory', JSON.stringify(searchArray));
        console.log('Search input stored in local storage:', JSON.stringify(searchArray));
    }
});










