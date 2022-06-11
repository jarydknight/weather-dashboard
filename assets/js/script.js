// API Key - RIP privacy since can't use back end for API calls yet
const apiKey = "312b5b9a9239037b60c85af07d3ebfbe";

// Function to make API calls to get weather for location
const getWeather = (coordinate) => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinate.lat}&lon=${coordinate.long}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`).then(res => {
    res.json().then(data => {
        console.log(data);
        })
    })
}

// FUnction to make API calls to get coordinates for location
const getCoordinates = (location) => {
    let coordinate;

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`).then(res => res.json().then(data => {
        coordinate = {
            lat: data[0].lat,
            long: data[0].lon
        };
        getWeather(coordinate);
    }))
};

const unixToDate = (unixTime) => {
    const date = moment.unix(unixTime).format("dddd MMMM Do, YYYY");
    return date;
}


getCoordinates("portland")


// setTimeout(function() {
//     console.log(coordinate)
// }, 5000)