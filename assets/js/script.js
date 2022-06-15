// API Key - RIP privacy since can't use back end for API calls yet
const apiKey = "312b5b9a9239037b60c85af07d3ebfbe";

// Search Button Element
const searchButtonEl = $(".search-button");

// Search Bar Element
const searchBarEl = $(".search-bar");

// Current weather element
const currentWeatherEl = $(".current-weather");

// History container element
const historEl = $(".history");

// Icon URL
const iconUrl = "https://openweathermap.org/img/w/";

// Search History array
let searchHistory;

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
                    date: unixToDate(data.current.dt),
                    icon: data.current.weather[0].icon
                },
                fiveDayForecast: [data.daily[1], data.daily[2], data.daily[3], data.daily[4], data.daily[5]]
            };
            renderData(weatherData);
            saveHistory();
            renderSearchHistory();
        })
    })
}

// Function to make API calls to get coordinates for location
const getCoordinates = (location) => {
    let coordinate;

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`)
    .then(res => res.json()
    .then(data => {
        coordinate = {
            lat: data[0].lat,
            long: data[0].lon
        };
        getWeather(coordinate);
    }))
    .catch(function (err) {
        alert("Error: Please enter a valid city");
    })
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
    currentWeatherEl.children(".uvi").html(`UV Index: <span>${weatherData.current.uvi}</span>`);
    setUviColor(weatherData.current.uvi);
    
    currentWeatherEl.children(".current-weather-title").html(`${searchBarEl.val().toUpperCase()} (${weatherData.current.date}) <img src='${iconUrl}${weatherData.current.icon}.png' alt=''>`);

    for (let i = 0; i < weatherData.fiveDayForecast.length; i++) {
        let cardEl = $(`.card[data-day='${i}']`);

        cardEl.children(".card-body").children(".card-title").html(`<h5>${unixToDate(weatherData.fiveDayForecast[i].dt)} <img src='${iconUrl}${weatherData.fiveDayForecast[i].weather[0].icon}.png' alt=''></h5>`)

        cardEl.children(".card-body").children(".card-temp").text(`Temp: ${Math.round(weatherData.fiveDayForecast[i].temp.day)}° C`);

        cardEl.children(".card-body").children(".card-wind").text(`Wind: ${weatherData.fiveDayForecast[i].wind_speed}KM/H`);

        cardEl.children(".card-body").children(".card-humidity").text(`Humidity: ${weatherData.fiveDayForecast[i].humidity}%`);
    }
}

const updateHeaderBg = () => {
    const currentTime = Number(moment().format("H"));
    
    if (currentTime >= 6 && currentTime <= 10) {
        $("header").addClass("morning");
    }
    else if (currentTime >= 11 && currentTime <= 17) {
        $("header").addClass("day");
    }
    else if (currentTime >= 18 && currentTime <= 20) {
        $("header").addClass("evening");
    }
    else {
        $("header").addClass("night");
    }
};

const getHistory = () => {
    if(!localStorage.getItem("weather-search-history")) {
        searchHistory = [];
    }
    else {
        searchHistory = JSON.parse(localStorage.getItem("weather-search-history"));
    }
};

const saveHistory = () => {
    if (!searchHistory.includes(searchBarEl.val().toUpperCase().trim())) {
        searchHistory.push(searchBarEl.val().toUpperCase().trim());

        localStorage.setItem("weather-search-history", JSON.stringify(searchHistory))
    }
};

const renderSearchHistory = () => {
    historEl.text("");

    searchHistory.forEach(search => {
        historEl.append(`<p class='rounded search-result'>${search}</p>`);
    })
};

const setUviColor = (uvi) => {
    if (uvi <= 2 ) {
        currentWeatherEl.children(".uvi").children("span").addClass("green");
    }
    else if (uvi > 2 && uvi <= 5) {
        currentWeatherEl.children(".uvi").children("span").addClass("yellow");
    }
    else if (uvi > 5 && uvi <= 7) {
        currentWeatherEl.children(".uvi").children("span").addClass("orange");
    }
    else {
        currentWeatherEl.children(".uvi").children("span").addClass("red")
    }
}

// Function call to updater header bg color
updateHeaderBg();

// Function call to retrieve search history from local storage and render it
getHistory();
renderSearchHistory();

// time delays: delay is for an hour, delayToNextHour calculates the delay to the next hour
const delay = 60 * 60 * 1000;
const delayToNextHour = (60 - parseInt(moment().format("LT").slice(3))) * 60000;

// Audit's time squares every hour. First calculate delay to the next hour with set timeout then run every hour with set interval
setTimeout(function() {
    setInterval(updateHeaderBg, delay);
}, delayToNextHour);

// Event listener for for submission
$("form").submit(function(event) {
    event.preventDefault();
    let location = $(".search-bar").val();
    getCoordinates(location);
});

// Event listener for "Enter" keypress on serchBarEl to so that form is submitted and new line is not created
searchBarEl.keypress(e => {
    if (e.which === 13) {
        e.preventDefault();
        $("form").submit();
    }
})

// Event listener for clicks on search history item
historEl.on("click", "p", function(event) {
    searchBarEl.val(event.target.innerText)
    getCoordinates(event.target.innerText);
});