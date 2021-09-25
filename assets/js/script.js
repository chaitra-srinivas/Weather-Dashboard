var submitBtnEl = document.querySelector("#submit-city");
var searchFormEl = document.querySelector("#search-form");
var curWeatherEl = document.querySelector("#cur-weather");
var apiKey = "d1a3e244cfb4477cc46192f257eb4d5d";


function getUserInput(event){
event.preventDefault();

var cityNameEl = document.querySelector("#city-name").value;

console.log(cityNameEl);
if(!cityNameEl){
    console.error("Please enter a city");
    return;
}

getCityWeather(cityNameEl);

}

searchFormEl.addEventListener("submit",getUserInput);

function getCityWeather(cityNameEl){

    //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

    var weaQueryUrl = "https://api.openweathermap.org/data/2.5/weather"
    var queryUrl = weaQueryUrl +"?q="+ cityNameEl + "&appid="+ apiKey;

    fetch(queryUrl).then(function (response){
        if (!response.ok){
            throw response.json();
        }
        return response.json();
    }).then( function(queryRes){
        console.log(queryRes);
    }
    ).catch(function (error){
        console.error(error);
    });

}