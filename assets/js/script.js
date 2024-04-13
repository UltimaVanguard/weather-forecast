// JavaScript variables for HTML elements
const searchFormEl = $('.search-form');
const searchInputEl = $('#search');
const historyEl = $('#history');
const todayWeatherEl = $('#today');
const wthForecastEl = $('#five-day');

// Get history from local storage or initialize empty array
let historyArray = JSON.parse(localStorage.getItem('history')) || [];

function displayHistory(history) {
    const histButton = $('<button>');
    histButton.addClass('button hist-btn');
    histButton.attr('data-history', history);
    histButton.text(history);

    historyEl.append(histButton);
}

function saveHistory(location) {
    console.log(location);
    for (i = 0; i < historyArray.length; i++) {
        if (location === historyArray[i]) {
            historyArray.splice(i, 1);
            historyArray.unshift(location);
            return;
        }
    }

    if (historyArray.length === 10) {
        historyArray.pop();
        historyArray.unshift(location);
    } else {
        historyArray.unshift(location);
    }

    localStorage.setItem('history', JSON.stringify(historyArray));
}

function updateHistory() {
    $('.hist-btn').remove();

    if (historyArray) {
        for (let history of historyArray) {
            displayHistory(history);
        }
    }
}

function getForecast(weather) {
    console.log('here is the weather')
}

function fetchWeather(event) {
    event.preventDefault();

    const searchLocation = searchInputEl.val().substr(0,1).toUpperCase() + searchInputEl.val().substr(1);;
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
            saveHistory(searchLocation);
            updateHistory();
        })
}

searchFormEl.on('submit', fetchWeather);

window.load = (updateHistory());