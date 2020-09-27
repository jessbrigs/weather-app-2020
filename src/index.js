let now = new Date();
let currentDate = document.querySelector("#current-date");

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let date = now.getDate();
let year = now.getFullYear();
let day = days[now.getDay()];
let month = months[now.getMonth()];
let hours = now.getHours();
let minutes = now.getMinutes();

if (hours < 10) {
  hours = `${hours}`;
}
{
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
}

currentDate.innerHTML = `${day}, ${month} ${date}, ${year} | ${hours}:${minutes} `;

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayCurrentWeather(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#weather-icon")
    .setAttribute("alt", response.data.weather[0].description);

  celsiusTemp = response.data.main.temp;
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 4; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
          <div class="col-3">
          <h3>
            ${formatHours(forecast.dt * 1000)}
           </h3>
            <img src="http://openweathermap.org/img/wn/${
              forecast.weather[0].icon
            }@2x.png" />
            <div class="weather-forecast">
            <strong>H: ${Math.round(forecast.main.temp_max)}°C</strong> 
          </div>
        </div>
  `;
  }
}

function search(city) {
  let apiKey = "ed88c898fe3aa0b840199cac2d2d0db1";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ed88c898fe3aa0b840199cac2d2d0db1&units=metric`;
  axios.get(apiUrl).then(displayCurrentWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=ed88c898fe3aa0b840199cac2d2d0db1&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function submitted(event) {
  event.preventDefault();
  let city = document.querySelector("#the-city").value;
  search(city);
}

let form = document.querySelector("#location-search");
form.addEventListener("submit", submitted);

function changeToFahrenheit(event) {
  event.preventDefault();
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
}

function searchLocation(position) {
  let apiKey = "ed88c898fe3aa0b840199cac2d2d0db1";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=ed88c898fe3aa0b840199cac2d2d0db1&units=metric`;

  axios.get(apiUrl).then(displayCurrentWeather);
}
function getCurrent(event) {
  event.preventDefault;
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function changeToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

let celsiusTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", changeToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", changeToCelsius);

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", getCurrent);

search("Toronto");
