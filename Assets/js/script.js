document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event triggered');

    let searchButton = document.getElementById('search-button');
    let searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        console.log('Search button clicked');
        // Call the splitSearch function and log the result to the console
        const searchArray = splitSearch();
        console.log('Search Array:', searchArray);

        const city = searchArray[0];
        const state = searchArray[1]
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
                        .then(weatherData => {
                            console.log(weatherData);
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

        // Store the search input to local storage
        storeSearchInput(searchArray);
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








