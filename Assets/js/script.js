document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event triggered');
    let weatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=7b1eab3296911715f248b7a79b72ba34';
    let searchButton = document.getElementById('search-button');
    let searchInput = document.getElementById('search-input');
  
    searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        console.log('Search button clicked');
      // Call the splitSearch function and log the result to the console
      const searchArray = splitSearch();
      console.log('Search Array:', searchArray);
  
      // Store the search input to local storage
      storeSearchInput(searchArray);
    });
  
    // Function to split the search input
    function splitSearch() {
      return searchInput.value.split(' ');
    }
  
    function storeSearchInput(searchArray) {
      // Check if local storage is supported by the browser
      if (typeof (Storage) !== "undefined") {
        // Convert the array to JSON and store it in local storage
        localStorage.setItem('searchHistory', JSON.stringify(searchArray));
        console.log('Search input stored in local storage:', JSON.stringify(searchArray));
      } else {
        console.error('Local storage is not supported in this browser');
      }
    }
  });
  
  
  

