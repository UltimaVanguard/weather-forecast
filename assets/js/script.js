// JavaScript variables for HTML elements
const searchFormEl = $('.search-form');
const searchInputEl = $('#search');
const historyEl = $('#history');
const forecastEl = $('.forecast');
const apiKey = '4f194bed6606dee76ffaf3829b41e1e9'


// Get history from local storage or initialize empty array
let historyArray = JSON.parse(localStorage.getItem('history')) || [];

function displayHistory(history) {
    const histButton = $('<button>');
    histButton.addClass('button hist-btn col-7 m-1 p-1');
    histButton.attr('data-history', history);
    histButton.text(history);

    historyEl.append(histButton);
}

function saveHistory(location) {
    for (i = 0; i < historyArray.length; i++) {
        if (location === historyArray[i]) {
            historyArray.splice(i, 1);
            historyArray.unshift(location);
            return;
        }
    }

    if (historyArray.length === 15) {
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

function buildTodayWeather(weather) {
    const card = $('<div>');
    card.addClass('card today-card col-12 m-1 p-2');

    const todayHeader = $('<h2>');
    todayHeader.addClass('card-header today-header')
    if (weather.weather[0].main === "Clear") {
        todayHeader.text(`Today's weather for: ${weather.name}☀️`);
    } else if (weather.weather[0].main === "Clouds") {
        todayHeader.text(`Today's weather for: ${weather.name}⛅`);
    } else if (weather.weather[0].main === "Rain") {
        todayHeader.text(`Today's weather for: ${weather.name}🌧️`);
    } else if (weather.weather[0].main === "Snow") {
        todayHeader.text(`Today's weather for: ${weather.name}🌨️`);
    } else {
        todayHeader.text(`Today's weather for: ${weather.name}❓`)
    }

    const todayCard = $('<div>');
    todayCard.addClass('card today-body m-1 p-1');

    const todayTemp = $('<p>');
    todayTemp.text(`Temperature: ${weather.main.temp}°F`);

    const todayHumidity = $('<p>');
    todayHumidity.text(`Humidity: ${weather.main.humidity}%`);

    const todayWind = $('<p>');
    todayWind.text(`Wind: ${weather.wind.speed} MPH`);
    
    todayCard.append(todayTemp, todayHumidity, todayWind);
    card.append(todayHeader, todayCard);
    forecastEl.append(card);
}

function buildForecast(forecasts) {
    console.log(forecasts);
    const forecastSection = $('<section>');
    forecastSection.addClass('row d-flex justify-content-around align-self-end m-2 p-2');

    const forecastHeader = $('<h2>');
    forecastHeader.addClass('text-center m-1 p-2');
    forecastHeader.text('Upcoming Weather Forecast');
    forecastSection.append(forecastHeader);

    for (let forecast of forecasts) {
        const dateArray = forecast.dt_txt.split(' ');
        if (dateArray[1] === '12:00:00') {
            const forecastCard = $('<div>');
            forecastCard.addClass('card forecast-card col-lg-2 col-md-12 mb-2');

            const forecastDate = $('<h6>');
            forecastDate.addClass('card-header forecast-header text-center');
            forecastDate.text(dateArray[0]);
            if (forecast.weather[0].main === "Clear") {
                forecastDate.text(`${dateArray[0]}☀️`);
            } else if (forecast.weather[0].main === "Clouds") {
                forecastDate.text(`${dateArray[0]}⛅`);
            } else if (forecast.weather[0].main === "Rain") {
                forecastDate.text(`${dateArray[0]}🌧️`);
            } else if (forecast.weather[0].main === "Snow") {
                forecastDate.text(`${dateArray[0]}🌨️`);
            } else {
                forecastDate.text(`${dateArray[0]}❓`);
            }

            const forecastBody = $('<div>');
            forecastBody.addClass('card m-1 p-1')

            const forecastTemp = $('<p>');
            forecastTemp.addClass('card-text');
            forecastTemp.text(`Temp: ${forecast.main.temp}°F`)

            const forecastHumidity = $('<p>');
            forecastHumidity.addClass('card-text');
            forecastHumidity.text(`Humidity: ${forecast.main.humidity}%`);

            const forecastWind = $('<p>');
            forecastWind.addClass('card-text');
            forecastWind.text(`Wind: ${forecast.wind.speed} MPH`);

            forecastBody.append(forecastTemp, forecastHumidity, forecastWind);
            forecastCard.append(forecastDate, forecastBody);
            forecastSection.append(forecastCard);
            forecastEl.append(forecastSection);
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
                console.log('error');
            }
        })
        .then(function(forecast) {
            forecastEl.empty();
            buildTodayWeather(coordinates);
            buildForecast(forecast.list);
        })
}

function fetchWeather(event) {
    event.preventDefault();
    let capitalArray = [];

    let searchArray = searchInputEl.val().split(' ');
    for (let word of searchArray) {
        word = word.substr(0,1).toUpperCase() + word.substr(1).toLowerCase();
        capitalArray.push(word);
    }
    const searchLocation = capitalArray.join(' ');
    const coordsUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&units=imperial&APPID=${apiKey}`;

    fetch(coordsUrl)
        .then(function(response) {
            if(response.ok) {
                return response.json();
            } else {
                alert('An error has occurred. Please try again!');
                return
            }
        })
        .then(function(coordinates) {
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