/**
  List of sources used:
  learning how to use JSON & creating the table: http://www.w3schools.com/js/js_json_intro.asp
  learning how to set the background image through JS: http://stackoverflow.com/questions/18665702/javascript-setting-background-image-of-a-div-via-a-function-and-function-paramet
*/

var uOC = "metric";
window.onload = updateCity("Toronto");
var cityWeather = "Toronto";
var cF = "°C";
var uOfSpd = "Km/H"
var apiKey = config.MY_KEY;
/*
  On load function that calls all sub functions for the daily forecast, 3 hour forecast and
  weekly forecast.
  The retrieve functions take in a string set to "metric" or "imperial" as their value.
  This function serves as the default load when the "weather" button is pressed and updates the city.
*/
function updateCity(city)
{
  console.log(uOC);
  cityWeather = city;
  retrieveCurrentWeather(uOC);
  retrieveThreeHrForecast(uOC);
  retrieveWeekForecast(uOC);
}

function changeConversion(value)
{
  if (value.toUpperCase() == "metric".toUpperCase())
  {
    uOfSpd = "Km/H"
    cF = "°C";
    uOC = "metric";
  }
  if (value.toUpperCase() == "imperial".toUpperCase())
  {
    uOfSpd = "MPH";
    cF = "°F";
    uOC = "imperial";
  }
  console.log(uOC);
  retrieveCurrentWeather(uOC);
  retrieveThreeHrForecast(uOC);
  retrieveWeekForecast(uOC);
}

function retrieveCurrentWeather(conv)
{
  var unit = conv;
  //Creating new variable to make HTTP Request
  var xhttp = new XMLHttpRequest();
  //Call function on state change.
  xhttp.onreadystatechange = function()
  {
    //Ready state 4 == Request is complete
    //Status == 200 - Server response is correct.
    if (this.readyState == 4 && this.status == 200)
    {
      var myObj = JSON.parse(this.responseText);
      document.getElementById("cName").innerHTML = myObj.city.name;
      printCurrentWeather(myObj);
    }
  };
  xhttp.open("GET", "http://api.openweathermap.org/data/2.5/forecast?q=" + cityWeather + "&units=" + unit + "&APPID=" + apiKey, true);
  xhttp.send();
}
/*
  Calls the api to retrieve the 3 hour forecast.
*/
function retrieveThreeHrForecast(conv)
{
  var unit = conv;
  //Creating new variable to make HTTP Request
  var xhttp = new XMLHttpRequest();
  //Call function on state change.
  xhttp.onreadystatechange = function()
  {
    //Ready state 4 == Request is complete
    //Status == 200 - Server response is correct.
    if (this.readyState == 4 && this.status == 200)
    {
      var myObj = JSON.parse(this.responseText);
      //document.getElementById("cFor").innerHTML = myObj.city.name;
      //console.log(JSON.stringify(myObj))
      printThreeHrForecast(myObj)
    }
  };
  xhttp.open("GET", "http://api.openweathermap.org/data/2.5/forecast?q=" + cityWeather + "&units=" + unit +"&cnt=8&APPID=" + apiKey, true);
  xhttp.send();
}
/*
  Sends the request to the API to retrieve the data to display the weekly forecast.

*/
function retrieveWeekForecast(conv)
{
  var unit = conv;
  //Creating new variable to make HTTP Request
  var xhttp = new XMLHttpRequest();
  //Call function on state change.
  xhttp.onreadystatechange = function()
  {
    //Ready state 4 == Request is complete
    //Status == 200 - Server response is correct.
    if (this.readyState == 4 && this.status == 200)
    {
      var myObj = JSON.parse(this.responseText);
      //document.getElementById("cFor").innerHTML = myObj.city.name;
      //console.log(JSON.stringify(myObj))
      printWeeklyForecast(myObj);
    }
  };
  xhttp.open("GET", "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + cityWeather + "&units=" + unit +"&cnt=5&type=like&APPID=" + apiKey, true);
  xhttp.send();
}

//Beggining of printing methods:

/*
  Retrieves from the API, and sets the current weather temperature, condition, wind speed, and humidity.

*/
function printCurrentWeather(weatherObj)
{
  setImage(weatherObj.list[0].weather[0].main);
  document.getElementById("cName").innerHTML = weatherObj.city.name + "";
  document.getElementById("cwTemp").innerHTML = weatherObj.list[0].main.temp + cF;
  document.getElementById("cwCond").innerHTML = setIconImage(weatherObj.list[0].weather[0].main) ;
  if(uOC == "metric")
  {
    document.getElementById("cwWind").innerHTML = "Wind Speed: " + Math.round(weatherObj.list[0].wind.speed * 3.6) + "Km/H |";
  }
  if(uOC == "imperial")
  {
    document.getElementById("cwWind").innerHTML = "Wind Speed: " + Math.round(weatherObj.list[0].wind.speed) + "MPH |";
  }
  document.getElementById("cwHum").innerHTML = "Humidity: " + weatherObj.list[0].main.humidity + "%";
}
/**
  This method obtains the weather object for the three hour forecast and proceeds to print it.
"2017-02-13T03:00:00.000Z"
*/
function printThreeHrForecast(weatherObj)
{
  var dataTb = "<table style='width:70%'>";
  var date;
  for(i=0; i< weatherObj.list.length; i++)
  {
    date = new Date(weatherObj.list[i].dt *1000)
    console.log(JSON.stringify(date));
    dataTb += "<tr><td>" + JSON.stringify(date).substring(12,17) + "</td><td>" + setIconImage(weatherObj.list[i].weather[0].main) + "</td><td>" + weatherObj.list[i].main.temp + cF +
              "</td><td>" + weatherObj.list[i].main.humidity + "%" + "</td><td>";
    if(uOC == "metric")
    {
      dataTb += Math.round(weatherObj.list[i].wind.speed * 3.6) + "km/h </td></tr>";
    }
    if(uOC == "imperial")
    {
      dataTb += Math.round(weatherObj.list[i].wind.speed * 3.6) + "mph </td></tr>";
    }
     weatherObj.list[i].wind.speed
    //threeHr += weatherObj.list[i].main.temp + " Date: " + weatherObj.list[i].weather[0].main+ "<br>";
  }
  dataTb += "</table>";
  document.getElementById("hrWtble").innerHTML = dataTb;
}

/**
  This method obtains the weather object for the three hour forecast and proceeds to print it.

*/
function printWeeklyForecast(weatherObj)
{
  var weekDataTb = "<table style='width:70%'>";
  for(i = 0; i < weatherObj.list.length; i++)
  {
    /*
      Getting the date from the forecast array and
      converting it into JS time by multiplying by 1000
    */
    date = new Date(weatherObj.list[i].dt *1000)
    switch(date.getDay())
    {
      case 0:
        weekDataTb += "<tr><td> Sunday </td><td>" + setIconImage(weatherObj.list[i].weather[0].main) + "</td><td>" + weatherObj.list[i].temp.day + cF +
                  "</td><td>" + weatherObj.list[i].humidity + "%" + "</td><td>";
        if(uOC == "metric")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "km/h </td></tr>";
        }
        if(uOC == "imperial")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "mph </td></tr>";
        }
        break;
      case 1:
        weekDataTb += "<tr><td> Monday </td><td>" + setIconImage(weatherObj.list[i].weather[0].main) + "</td><td>" + weatherObj.list[i].temp.day + cF +
                "</td><td>" + weatherObj.list[i].humidity + "%" + "</td><td>";
        if(uOC == "metric")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "km/h </td></tr>";
        }
        if(uOC == "imperial")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "mph </td></tr>";
        }
        break;
      case 2:
        weekDataTb += "<tr><td> Tuesday </td><td>" + setIconImage(weatherObj.list[i].weather[0].main)+ "</td><td>" + weatherObj.list[i].temp.day + cF +
                "</td><td>" + weatherObj.list[i].humidity+ "%" + "</td><td>";
        if(uOC == "metric")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "km/h </td></tr>";
        }
        if(uOC == "imperial")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "mph </td></tr>";
        }
        break;
      case 3:
        weekDataTb += "<tr><td> Wednesday </td><td>" + setIconImage(weatherObj.list[i].weather[0].main) + "</td><td>" + weatherObj.list[i].temp.day + cF +
                "</td><td>" + weatherObj.list[i].humidity + "%" + "</td><td>";
        if(uOC == "metric")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "km/h </td></tr>";
        }
        if(uOC == "imperial")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "mph </td></tr>";
        }
        break;
      case 4:
        weekDataTb += "<tr><td> Thursday </td><td>" + setIconImage(weatherObj.list[i].weather[0].main) + "</td><td>" + weatherObj.list[i].temp.day + cF +
                "</td><td>" + weatherObj.list[i].humidity + "%" + "</td><td>";
        if(uOC == "metric")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "km/h </td></tr>";
        }
        if(uOC == "imperial")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "mph </td></tr>";
        }
        break;
      case 5:
        weekDataTb += "<tr><td> Friday </td><td>" + setIconImage(weatherObj.list[i].weather[0].main) + "</td><td>" + weatherObj.list[i].temp.day + cF +
                "</td><td>" + weatherObj.list[i].humidity + "%" + "</td><td>";
        if(uOC == "metric")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "km/h </td></tr>";
        }
        if(uOC == "imperial")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "mph </td></tr>";
        }
        break;
      case 6:
        weekDataTb += "<tr><td> Saturday </td><td>" + setIconImage(weatherObj.list[i].weather[0].main) + "</td><td>" + weatherObj.list[i].temp.day + cF +
                "</td><td>" + weatherObj.list[i].humidity + "%" + "</td><td>";
        if(uOC == "metric")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "km/h </td></tr>";
        }
        if(uOC == "imperial")
        {
          weekDataTb += Math.round(weatherObj.list[i].speed * 3.6) + "mph </td></tr>";
        }
    }
  }
  weekDataTb += "</table>";
  document.getElementById("weekTble").innerHTML = weekDataTb;
}

function setIconImage(wDetail)
{
  var bckImg = '<img src="images/sun-icon.png" alt="" height=41 width=38> </img>'
  if(wDetail.toUpperCase() == "clouds".toUpperCase())
  {
      bckImg = '<img src="images/cloudy-icon.png" alt="" height=41 width=38> </img>'
  }
  else if(wDetail.toUpperCase() == "rain".toUpperCase())
  {
      bckImg = '<img src="images/rain-icon.png" alt="" height=41 width=38> </img>'
  }
  else if(wDetail.toUpperCase() == "snow".toUpperCase())
  {
      bckImg = '<img src="images/winter-icon.png" alt="" height=41 width=38> </img>'
  }
  else
  {
      bckImg = '<img src="images/sun-icon.png" alt="" height=41 width=38> </img>'
  }
  return bckImg;
}
/*
  Takes in the current weather description and then based on the value, sets the according background
  image to the weather panel.
  Default value is set to clear skies.
*/
function setImage(wDetail)
{
  var bckImg = "url(../images/clear.jpg)";
  document.getElementById("weatherPan").style.backgroundImage = "url(images/clear.jpg)";
  if(wDetail.toUpperCase() == "clouds".toUpperCase())
  {
    bckImg = 'url(images/cloudy.jpg)';
    document.getElementById("weatherPan").style.backgroundImage = bckImg;
  }
  else if(wDetail.toUpperCase() == "clear".toUpperCase())
  {
    bckImg = 'url(images/clear.jpg)';
    document.getElementById("weatherPan").style.backgroundImage = bckImg;
  }
  else if(wDetail.toUpperCase() == "snow".toUpperCase())
  {
    bckImg = 'url(images/winter.jpg)';
    document.getElementById("weatherPan").style.backgroundImage = bckImg;
  }
  else if(wDetail.toUpperCase() == "additional".toUpperCase())
  {
    bckImg = 'url(images/sunny.jpg)';
    document.getElementById("weatherPan").style.backgroundImage = bckImg;
  }
  else
  {
    bckImg = 'url(images/rain.jpg)';
    document.getElementById("weatherPan").style.backgroundImage = bckImg;
  }
}
