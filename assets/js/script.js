var $submitBtnEl = $("#submit-city");
var $searchFormEl = $("#search-form");
var $curWeatherEl = $("#cur-weather");

/* var apiKey = new URL(window.location).searchParams.get("token"); */
var apiKey = "d1a3e244cfb4477cc46192f257eb4d5d";

renderStoredCityList(getCityListFromStorage());

function getUserInput(event) {
  event.preventDefault();

  var cityName = $("#city-name").val();

  console.log(cityName);
  if (!cityName) {
    console.error("Please enter a city");
    return;
  }

  getCityWeather(cityName);
 /*  storeCity(cityName); */
/*   renderStoredCityList(getCityListFromStorage()); */
 
}


function getCityListFromStorage() {
  var cityListStr = localStorage.getItem("CITY_LIST");
  if (cityListStr) {
    return JSON.parse(cityListStr);
  } else {
    return [];
  }
}

function setCityListToStorage(cityList) {
  var cityListStr = JSON.stringify(cityList);
  localStorage.setItem("CITY_LIST", cityListStr);
}

// Checks if the city name has already been added to the local storage.
function storeCity(cityName) {
  var cityList = getCityListFromStorage();

  if (cityList.find((val) => val.toLowerCase() === cityName.toLowerCase())) {
    return;
  }
  cityList.push(cityName);
  setCityListToStorage(cityList);
}

$searchFormEl.submit(getUserInput);

function getCityWeather(cityName) {
  //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
  // using the URL api

  var curWeatherURL = new URL(
    "https://api.openweathermap.org/data/2.5/weather"
  );
  curWeatherURL.searchParams.set("q", cityName);
  curWeatherURL.searchParams.set("units", "metric");
  curWeatherURL.searchParams.set("appid", apiKey);

  fetch(curWeatherURL)
    .then(function (response) {
      if (!response.ok) {
        alert("Some thing went wrong-Please enter a valid city name");
        throw response.json();
       }
      return response.json();
    })
    .then(function (queryRes) {
      console.log(queryRes);
      renderQueryResults(queryRes);
      storeCity(cityName);
      renderStoredCityList(getCityListFromStorage());
    })
    .catch(function (error) {
      console.error(error);
    });
}

// Function to print the current weather conditions for the city

function renderQueryResults(queryRes) {
  var $curDate = moment.unix(queryRes.dt).format("DD/MM/YYYY");

  $("#cur-icon").attr("src", getIconPath(queryRes.weather[0].icon));
  $("#cur-icon").attr("title", queryRes.weather[0].description);
  $("#city-name-cur-date").text(queryRes.name + " (" + $curDate + ")");
  $("#cur-temp").text("Temp: " + queryRes.main.temp + " °C");
  $("#cur-wind").text("Wind: " + queryRes.wind.speed + " km/h");
  $("#cur-humidity").text("Humidity: " + queryRes.main.humidity + " %");

  // To get uv index

  // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

  // latitude and longitude values for the current city

  getUVIndex(queryRes.coord.lat,queryRes.coord.lon);

}

// function to get the UV Index

function getUVIndex(lat,lon){
  var latitude = lat;
  var longitude = lon;

  var queryUVIndex = new URL("https://api.openweathermap.org/data/2.5/onecall");
  queryUVIndex.searchParams.set("lat", latitude);
  queryUVIndex.searchParams.set("lon", longitude);
  queryUVIndex.searchParams.set("units", "metric");
  queryUVIndex.searchParams.set("appid", apiKey);

  fetch(queryUVIndex)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (UVdata) {
      uvIndexWarning(UVdata.current.uvi);
      renderForecastResults(UVdata.daily);
    })
    .catch(function (error) {
      console.error(error);
    });

}


// Color coding uv index badges based on the current index value
function uvIndexWarning(uvIndex) {
  var curUVEl = $("#cur-UV");
  var uvIndexEl = $('#uvIndex');

  uvIndexEl.text('UV Index: ');
  curUVEl.removeClass(
    "bg-secondary bg-primary bg-success bg-warning bg-danger"
  );

  if (uvIndex <= 3) {
    curUVEl.addClass("bg-secondary");
    curUVEl.text(uvIndex);
  }
  if (uvIndex > 3 && uvIndex < 7) {
    curUVEl.addClass("bg-primary");
    curUVEl.text(uvIndex);
  }
  if (uvIndex > 7 && uvIndex < 8) {
    curUVEl.addClass("bg-success");
    curUVEl.text(uvIndex);
  }
  if (uvIndex > 8 && uvIndex < 11) {
    curUVEl.addClass("bg-warning");
    curUVEl.text(uvIndex);
  }
  if (uvIndex >= 11) {
    curUVEl.addClass("bg-danger");
    curUVEl.text(uvIndex);
  }
}

function renderForecastResults(queryForecastRes) {
  console.log(queryForecastRes);

  for (var i = 1; i < queryForecastRes.length - 1; i++) {
    var elementPosition = i;
    var forecast = queryForecastRes[i];
    var forecastDate = moment.unix(forecast.dt).format("DD/MM/YYYY");
    $(`#forecast-date${elementPosition}`).text(forecastDate);
    $(`#forecast-icon${elementPosition}`).attr(
      "src",
      getIconPath(forecast.weather[0].icon)
    );
    $(`#forecast-temp${elementPosition}`).text('Temp: '+forecast.temp.max + " °C");
    $(`#forecast-wind${elementPosition}`).text('Wind: '+forecast.wind_speed + " Km/h");
    $(`#forecast-humidity${elementPosition}`).text('Humidity: '+forecast.humidity + " %");
  }
}

function renderStoredCityList(cityList) {
  $("#search-list").empty();

  for (var i = 0; i < cityList.length; i++) {
    var cityName = cityList[i];
    /* getCityWeather(cityName) */
    var anchorEl = $("<a>")
      .attr("href", "#")
      .attr("onClick", `getCityWeather('${cityName}')`)
      .attr("class", "text-decoration-none text-dark")
      .append(cityName);
    var listItem = $("<li>")
      .attr("class", "list-group-item bg-light text-center mt-2")
      .append(anchorEl);
    $("#search-list").append(listItem);
  }
}

function getIconPath(iconName) {
  return "https://openweathermap.org/img/w/" + iconName + ".png";
}
