// JavaScript variables for HTML elements
const searchForm = $('.search-form');
const searchInput = $('#search');
const history = $('#history');
const todayWeather = $('#today');
const wthForecast = $('#five-day');

// Get history from local storage or initialize empty array
// let historyArray = JSON.parse(localStorage.getItem('history')) || [];

function getForecast(weather) {
    console.log('here is the weather')
}

function fetchWeather(event) {
    event.preventDefault();

    const searchLocation = searchInput.val().substr(0,1).toUpperCase() + searchInput.val().substr(1);;
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&APPID=4f194bed6606dee76ffaf3829b41e1e9`;
    console.log(weatherURL);

    fetch(weatherURL)
        .then(function(response) {
            if(response.ok) {
                return response.json();
            } else {
                console.log('error')
            }
        })
        .then(function(weather) {
            console.log(weather);
            getForecast(weather);
            // saveHistory(searchLocation);
            // updateHistory();
        })
}

searchForm.on('submit', fetchWeather);