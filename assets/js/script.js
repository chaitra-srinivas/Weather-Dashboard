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

  // api.openweathermap.org/data/2.5/forecast?q=London&appid={API key}
  var weaQueryUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
  var queryUnits = "&units=metric";
  var queryUrl = weaQueryUrl + cityNameEl + queryUnits + "&appid=" + apiKey;

  fetch(queryUrl)
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

function renderQueryResults(queryRes) {
  console.log(queryRes.name);
  var $curDate = moment.unix(queryRes.dt).format("DD/MM/YYYY");
  var $weatherIcon = $("<img>");
  $weatherIcon.attr(
    "src",
    "https://openweathermap.org/img/w/" + queryRes.weather[0].icon + ".png"
  );
  $("#cur-icon").append($weatherIcon);
  $("#city-name-cur-date").append(queryRes.name + " (" + $curDate + ")");
  $("#cur-temp").append("Temp: " + queryRes.main.temp);
  $("#cur-wind").append("Wind: " + queryRes.wind.speed);
  $("#cur-humidity").append("Humidity: " + queryRes.main.humidity);

  // To get uv index

  // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
/* alert(JSON.stringify(queryRes)); */

  var latitude = queryRes.coord.lat;
  var longitude = queryRes.coord.lon;
  var queryUVIndex = "https://api.openweathermap.org/data/2.5/onecall?";
    var newurl = new URL("https://api.openweathermap.org/data/2.5/onecall");
    newurl.searchParams.set('lat', 12);
    newurl.searchParams.set('lon', 13);

    alert(newurl);

  var queryUnits = "&units=metric";
  var queryUVIndexUrl =
    queryUVIndex +
    /* queryRes.name + */
   /*  queryUnits + */
    "lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    apiKey;

     console.log(queryUVIndexUrl); 
  fetch(queryUVIndexUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      } 
      return response.json();
    })
    .then(function (UVdata) {
      console.log("This is uvdata: " + UVdata.current.uvi);
      /*  renderForecastResults(queryForecastRes); */
      $("#cur-UV").append("UV Index: " + UVdata.current.uvi);
    })
    .catch(function (error) {
      console.error(error);
    });
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
