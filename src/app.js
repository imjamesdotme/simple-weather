$(document).ready(function() {

  var url = "//api.openweathermap.org/data/2.5/weather?";
  var key = "&APPID=9fe60a1181a81b69ab73113b9a1de41d";
  var unit = "&units=metric";
  var lat = "lat=";
  var long = "lon=";

  var location, country, description, temp, tempHigh, tempLow, id, weatherIcon, windSpeed, sunrise, sunset;

  function currentPosition() {

    $('#loading').show();

    // Hide main wrapper again incase user search has been used first then 'Current Position' after.
    $('#wrapper').hide();

    if ("geolocation" in navigator) {

      navigator.geolocation.getCurrentPosition(function(position) {

        lat += position.coords.latitude;
        long += position.coords.longitude;

        var urlToRequest = url + lat + '&' + long + unit + key;

        getWeather(urlToRequest);
      });

    } else {
      $('#overlay').slideDown(300);
      $('#error').text('Your brower may not support geolocation.');
    }

  }

  function locationSearch() {
    var location = $('input').val().toLowerCase();
    var urlToRequest = url + 'q=' + location + unit + key;
    getWeather(urlToRequest);

    // Clear input for the next use.
    $('input').val("");
  }

  function getWeather(urlToRequest) {

    $.getJSON(urlToRequest)

    .done(function(weather) {

      var data = weather;
      console.log(data);
      displayWeather(data);
      $('#loading').hide();
      $('#wrapper').show();

    })

    .fail(function() {
      $('#overlay').slideDown(300);
      $('#error').text('Sorry it looks like somethings gone wrong.');
    });

  }

  function displayWeather(data) {

    location = data.name;
    country = data.sys.country;
    description = data.weather[0].description;
    temp = data.main.temp;
    tempHigh = data.main.temp_max;
    tempLow = data.main.temp_min;
    id = data.weather[0].id;
    weatherIcon = 'wi wi-owm-' + id;
    windSpeed = Math.round(data.wind.speed);
    sunrise = convertTime(data.sys.sunrise);
    sunset = convertTime(data.sys.sunset);

    // Remove any classes from a previous search.
    $('i, #temperature, #temp-high, #temp-low').removeClass();

    $('#location').text(location);
    $('#country').text(country);
    $('#description').text(description);
    $('#temperature').html(temp + '<sup>&deg; C</sup>');
    $('#temp-high').html(tempHigh + '<sup>&deg; C</sup>');
    $('#temp-low').html(tempLow + '<sup>&deg; C</sup>');
    $('#wind-speed').text(windSpeed + 'mph');
    $('#sunrise').text(sunrise);
    $('#sunset').text(sunset);
    $('i#weather-icon').addClass(weatherIcon);

    var weatherColour = '';

    if(temp > 25) {
      weatherColour += 'very-warm';
    } else if(temp >= 20) {
      weatherColour += 'warm';
    } else if(temp >= 12) {
      weatherColour += 'mild';
    } else if(temp >= 0) {
      weatherColour += 'cold';
    } else if(temp < 0) {
      weatherColour += 'very-cold';
    }

    // Set weather colour.
    $('i, #temperature, #temp-high, #temp-low').addClass(weatherColour);

  }

  function convertTime(time) {
    var seconds =  time;
    var date = new Date(seconds * 1000);
    var newTime = date.toLocaleTimeString();

    return newTime;
  }

  function convertTemp() {

    var tempUnit = $('#temperature').attr('data-unit');

    if(tempUnit === 'celsius') {

      var tempFahrenheit = Math.floor((temp * 1.8) + 32);
      var tempFahrenheitHigh = Math.floor((tempHigh * 1.8) + 32);
      var tempFahrenheitLow = Math.floor((tempLow * 1.8) + 32);

      $('#temperature').html(tempFahrenheit + '<sup>&deg; F</sup>');
      $('#temperature').attr('data-unit', 'fahrenheit');
      $('#temp-high').html(tempFahrenheitHigh + '<sup>&deg; F</sup>');
      $('#temp-low').html(tempFahrenheitLow + '<sup>&deg; F</sup>');

    } else {
      $('#temperature').html(temp + '<sup>&deg; C</sup>');
      $('#temperature').attr('data-unit', 'celsius');
      $('#temp-high').html(tempHigh + '<sup>&deg; C</sup>');
      $('#temp-low').html(tempLow + '<sup>&deg; C</sup>');
    }

  }

  // User location search.
  $('#submit').on('click', function(e) {
    e.preventDefault();
    $('#loading').show();
    locationSearch();
  });

  // Get users current location.
  $('#current-position').on('click', function(e){
    e.preventDefault();
    $('#loading').show();
    currentPosition();
  });

  // Change temperature units.
  $('#temperature, #temp-high, #temp-low').on('click', function() {
    convertTemp();
  });

  // Close error message.
  $('#close').on('click', function() {
    $('#overlay').slideUp(300);
  });

}); // End ready.
