// API Key - RIP privacy since can't use back end for API calls yet
const apiKey = "312b5b9a9239037b60c85af07d3ebfbe";

// Search Button Element
const searchButtonEl = $(".search-button");

// Search Bar Element
const searchBarEl = $(".search-bar");

// Function to make API calls to get weather for location
const getWeather = (coordinate) => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinate.lat}&lon=${coordinate.long}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`).then(res => {
        res.json()
        .then(data => {
            // Store data from API call in object to be passed to rendering function
            let weatherData = {
                current: {
                    temp: data.current.temp,
                    wind: data.current.wind_speed,
                    humidity: data.current.humidity,
                    uvi: data.current.uvi
                },
                fiveDayForecast: [data.daily[0], data.daily[1], data.daily[2], data.daily[3], data.daily[4]]
            };
            console.log(weatherData);
        })
    })
}

// FUnction to make API calls to get coordinates for location
const getCoordinates = (location) => {
    let coordinate;

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`)
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
    const date = moment.unix(unixTime).format("dddd MMMM Do, YYYY");
    return date;
}

// Function to render data on webpage
const renderData = (weatherData) => {

}

// Event listener for for submission
$("form").submit(function(event) {
    event.preventDefault();
    let location = $(".search-bar").val();
    getCoordinates(location);
});