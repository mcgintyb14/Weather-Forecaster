let weatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=7b1eab3296911715f248b7a79b72ba34'
let geoAPI = `https://api.opencagedata.com/geocode/v1/json?q=${city-input}%2C+${country-input}&key=b378f52f4b0d4e9cb5a38bbee769e7f5`
let searchButton = document.getElementById('search-button')

fetch(geoAPI)
.then(response => response.json())
.then(data => {
    console.log(data);
})

fetch(weatherAPI)
.then(response => response.json())
.then(data => {
  console.log(data);
});

searchButton.addEventListener('click', search => {
    search.preventDefault();

    const cityName = document.getElementById('city-input');



})
