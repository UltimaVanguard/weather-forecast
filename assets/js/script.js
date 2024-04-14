// JavaScript variables for HTML elements
const searchFormEl = $('.search-form');
const searchInputEl = $('#search');
const historyEl = $('#history');
const todayWeatherEl = $('#today');
const wthForecastEl = $('#five-day');
const apiKey = '4f194bed6606dee76ffaf3829b41e1e9'


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

function getForecast(coordinates) {
    const latitude = coordinates.coord.lat;
    const longitude = coordinates.coord.lon;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&APPID=${apiKey}`;

    fetch(weatherUrl)
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } else {
            console.log('error')
        }
    })
    .then(function(weather) {
        console.log(weather);
    })
}

function fetchWeather(event) {
    event.preventDefault();

    const searchLocation = searchInputEl.val().substr(0,1).toUpperCase() + searchInputEl.val().substr(1);
    const coordsUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&units=imperial&APPID=${apiKey}`;

    fetch(coordsUrl)
        .then(function(response) {
            if(response.ok) {
                return response.json();
            } else {
                console.log('error')
            }
        })
        .then(function(coordinates) {
            console.log(coordinates);
            getForecast(coordinates);
            saveHistory(searchLocation);
            updateHistory();
        })

    searchInputEl.val('');
}

function histSearch() {
    searchInputEl.val($(this).attr('data-history'));
    fetchWeather(event);
}

searchFormEl.on('submit', fetchWeather);

historyEl.on('click', '.hist-btn', histSearch);

window.load = (updateHistory());