const weatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=7b1eab3296911715f248b7a79b72ba34'

fetch(weatherAPI)
.then(response => response.json())
.then(data => {
  console.log(data);
});
