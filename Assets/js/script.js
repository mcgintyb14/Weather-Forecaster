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
        const country = searchArray[1];

        let geoAPI = `https://api.opencagedata.com/geocode/v1/json?q=${city}+${country}&key=b378f52f4b0d4e9cb5a38bbee769e7f5`;

        fetch(geoAPI)
            .then(response => response.json())
            .then(data => {
                const latitude = data.results[0].annotations.DMS.lat; // Convert to Number
                const longitude = data.results[0].annotations.DMS.lng; // Convert to Number

                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);

                let weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=7b1eab3296911715f248b7a79b72ba34`;

                fetch(weatherAPI)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                    })
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
    function convertDMSToDecimal(dms) {
        const [degrees, minutes, seconds] = dms.split(/\s|['"]/).filter(Boolean).map(Number);
        const decimal = degrees + (minutes / 60) + (seconds / 3600);
        return decimal;
    }

});








