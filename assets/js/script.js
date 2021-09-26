var $submitBtnEl = $("#submit-city");
var $searchFormEl = $("#search-form");
var $curWeatherEl = $("#cur-weather");

/* var apiKey = new URL(window.location).searchParams.get("token"); */
var apiKey = "d1a3e244cfb4477cc46192f257eb4d5d";

function getUserInput(event) {
  event.preventDefault();

  var $cityNameEl = $("#city-name").val();

  console.log($cityNameEl);
  if (!$cityNameEl) {
    console.error("Please enter a city");
    return;
  }

  getCityWeather($cityNameEl);
  getCityForecast($cityNameEl);
}

$searchFormEl.submit(getUserInput);

function getCityWeather(cityNameEl) {
//api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// using the URL api


var curWeatherURL = new URL("https://api.openweathermap.org/data/2.5/weather");
curWeatherURL.searchParams.set('q', cityNameEl);
curWeatherURL.searchParams.set('units', 'metric');
curWeatherURL.searchParams.set('appid', apiKey);


  fetch(curWeatherURL)
    .then(function (response) {
      if (!response.ok) {   
        throw response.json();
      }
      return response.json();
    })
    .then(function (queryRes) {
      console.log(queryRes);
      renderQueryResults(queryRes);
    })
    .catch(function (error) {
      console.error(error);
    });
}

function getCityForecast(cityNameEl) {
  // api.openweathermap.org/data/2.5/forecast?q=London&appid={API key}
  var weaForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
  var queryUnits = "&units=metric";
  var queryForecastUrl =
    weaForecastUrl + cityNameEl + queryUnits + "&appid=" + apiKey;

  fetch(queryForecastUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (queryForecastRes) {
      console.log(queryForecastRes);
      renderForecastResults(queryForecastRes);
    })
    .catch(function (error) {
      console.error(error);
    });
}

// Function to print the current weather conditions for the city

function renderQueryResults(queryRes) {
  console.log(queryRes.name);
  var $curDate = moment.unix(queryRes.dt).format("DD/MM/YYYY");
  var $weatherIcon = $("<img>");
  $weatherIcon.attr(
    "src",
    "https://openweathermap.org/img/w/" + queryRes.weather[0].icon + ".png"
  );
  $("#cur-icon").attr('src', "https://openweathermap.org/img/w/" + queryRes.weather[0].icon + ".png");
  $("#cur-icon").attr('title', queryRes.weather[0].description);
  $("#city-name-cur-date").text(queryRes.name + " (" + $curDate + ")");
  $("#cur-temp").text("Temp: " + queryRes.main.temp + ' °C');
  $("#cur-wind").text("Wind: " + queryRes.wind.speed + ' km/h');
  $("#cur-humidity").text("Humidity: " + queryRes.main.humidity + ' %');

  // To get uv index

 // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

 // latitude and longitude values for the current city

  var latitude = queryRes.coord.lat;
  var longitude = queryRes.coord.lon;

  var queryUVIndex = new URL("https://api.openweathermap.org/data/2.5/onecall");
  queryUVIndex.searchParams.set('lat', latitude);
  queryUVIndex.searchParams.set('lon', longitude);
  queryUVIndex.searchParams.set('appid', apiKey);

  fetch(queryUVIndex)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      } 
      return response.json();
    })
    .then(function (UVdata) {
     uvIndexWarning(UVdata.current.uvi)
     })
    .catch(function (error) {
      console.error(error);
    });
}
// Color coding uv index badges based on the current index value
function uvIndexWarning(uvIndex){
    var curUVEl =   $("#cur-UV");
    curUVEl.removeClass("bg-secondary bg-primary bg-success bg-warning bg-danger");

    if(uvIndex <= 3){
        curUVEl.addClass("bg-secondary");
        curUVEl.text(uvIndex);
    }
    if(uvIndex > 3 && uvIndex <7)
    {
        curUVEl.addClass("bg-primary");
        curUVEl.text(uvIndex);
    }
    if(uvIndex > 7 && uvIndex <8)
    {
        curUVEl.addClass("bg-success");
        curUVEl.text(uvIndex);
    }
    if(uvIndex > 8 && uvIndex <11)
    {
        curUVEl.addClass("bg-warning");
        curUVEl.text(uvIndex);
    }
    if(uvIndex >= 11)
    {
        curUVEl.addClass("bg-danger");
        curUVEl.text(uvIndex);
    }

}

function renderForecastResults(queryForecastRes) {
  var $curDate = moment.unix(queryForecastRes.dt).format("DD/MM/YYYY");

  console.log(queryForecastRes);

  /*  var $curDate = moment.unix(queryForecastRes.dt).format("DD/MM/YYYY");
    $("#city-name-cur-date").append(queryRes.name + " (" + $curDate +")");
    $("#cur-temp").append("Temp: " + queryRes.main.temp);
    $("#cur-wind").append("Wind: " + queryRes.wind.speed);
    $("#cur-humidity").append("Humidity: " + queryRes.main.humidity);
    $("#cur-UV").append("UV Index: " + queryRes.main.temp); */
}
