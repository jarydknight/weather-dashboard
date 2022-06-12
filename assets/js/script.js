// API Key - RIP privacy since can't use back end for API calls yet
const apiKey = "312b5b9a9239037b60c85af07d3ebfbe";

// Search Button Element
const searchButtonEl = $(".search-button");

// Search Bar Element
const searchBarEl = $(".search-bar");

// Current weather element
const currentWeatherEl = $(".current-weather");

// Function to make API calls to get weather for location
const getWeather = (coordinate) => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinate.lat}&lon=${coordinate.long}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`).then(res => {
        res.json()
        .then(data => {
            // Store data from API call in object to be passed to rendering function
            let weatherData = {
                current: {
                    temp: Math.round(data.current.temp),
                    wind: data.current.wind_speed,
                    humidity: data.current.humidity,
                    uvi: data.current.uvi,
                    date: unixToDate(data.current.dt)
                },
                fiveDayForecast: [data.daily[1], data.daily[2], data.daily[3], data.daily[4], data.daily[5]]
            };
            console.log(weatherData);
            renderData(weatherData);
        })
    })
}

// FUnction to make API calls to get coordinates for location
const getCoordinates = (location) => {
    let coordinate;

    fetch(` https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`)
    .then(res => res.json()
    .then(data => {
        coordinate = {
            lat: data[0].lat,
            long: data[0].lon
        };
        getWeather(coordinate);
    }))
};

// Convert unix time to date time string
const unixToDate = (unixTime) => {
    const date = moment.unix(unixTime).format("L");
    return date;
}

// Function to render data on webpage
const renderData = (weatherData) => {
    currentWeatherEl.children(".temp").text(`Temp: ${weatherData.current.temp}° C`);
    currentWeatherEl.children(".wind").text(`Wind: ${weatherData.current.wind} KM/H`);
    currentWeatherEl.children(".humidity").text(`Humidity: ${weatherData.current.humidity}%`);
    currentWeatherEl.children(".uvi").text(`UV Index: ${weatherData.current.uvi}`);
    currentWeatherEl.children(".current-weather-title").text(`${searchBarEl.val()} (${weatherData.current.date})`);

    for (let i = 0; i < weatherData.fiveDayForecast.length; i++) {
        let cardEl = $(`.card[data-day='${i}']`);

        cardEl.children(".card-body").children(".card-title").text(`${unixToDate(weatherData.fiveDayForecast[i].dt)}`)

        cardEl.children(".card-body").children(".card-temp").text(`Temp: ${Math.round(weatherData.fiveDayForecast[i].temp.day)}° C`);

        cardEl.children(".card-body").children(".card-wind").text(`Wind: ${weatherData.fiveDayForecast[i].wind_speed}KM/H`);

        cardEl.children(".card-body").children(".card-humidity").text(`Humidity: ${weatherData.fiveDayForecast[i].humidity}%`);
    }
}

// Event listener for for submission
$("form").submit(function(event) {
    event.preventDefault();
    let location = $(".search-bar").val();
    getCoordinates(location);
});