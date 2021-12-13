// selectors
var checkbox = document.querySelector("#toggle");
var html = document.querySelector("html");
var cityform = document.getElementById("city-form");
var cityformInput = document.querySelector("#current-location");
var blueAlert = document.querySelector("#blueAlert");
var closeBlueBtn = document.querySelector(".close-blue-btn");
var successAlert = document.querySelector("#successAlert");
var closeSuccessBtn = document.querySelector(".close-success-btn");
var warningAlert = document.querySelector("#warningAlert");
var closeWarningBtn = document.querySelector(".close-warning-btn");

mapboxgl.accessToken =
  "pk.eyJ1IjoiZm1pbGxzODkiLCJhIjoiY2t3eTM4bmkwMGFvdDMxb2F1ZDhsaGswYiJ9.rbSTg0blKEIsiji9lwSKIw";

// on 'submit' grab city name
var formSubmit = function (event) {
  event.preventDefault();

  var cityname = cityformInput.value.trim();

  if (cityname) {
    getCity(cityname);
    save(cityname);
    displayAlert(cityname);
    cityformInput.value = "";
  } else {
    console.log("ENTER VALID CITY");
  }
};

// based on user input - pull data for cities breweries
var getCity = function (city) {
  var requestUrl = "https://api.openbrewerydb.org/breweries?by_city=" + city;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // callback function for setupMap and pass data/city
      setupMap(data, city);
    });
};

// function for map
var setupMap = (data, city) => {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/dark-v10",
    center: [-98.4936, 29.424349],
    zoom: 12,
  });

  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav);

  // iterating through data long/lat to display markers
  for (var i = 0; i < data.length; i++) {
    var lng = data[i].longitude;
    var lat = data[i].latitude;

    const ll = new mapboxgl.LngLat(lng, lat);
    ll.toArray();
    console.log(ll);

    // Create a new marker.
    const marker = new mapboxgl.Marker()
      .setLngLat(ll)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            `<h2>${data[i].name}</h2>
              <h2>Brewery Type: ${data[i].brewery_type}</h2>
              <h2>${data[i].street}</h2>
              <h2>${data[i].postal_code}</h2>
              <h2>${data[i].state}</h2>
              <h2>${data[i].website_url}</h2>
              
              `
          )
      )
      .addTo(map);
  }
};

// START LOCAL STORAGE for toggle
if (localStorage.getItem("darkMode") === null) {
  localStorage.setItem("darkMode", "false");
}

function checkStatus() {
  if (localStorage.getItem("darkMode") === "true") {
    //the checkbox is checked (if you load the page by default it isn’t)
    toggle.checked = true;
    html.setAttribute("class", "dark");
  } else {
    toggle.checked = false;
    html.removeAttribute("class", "dark");
  }
}
// This function gets called every time the checkbox is clicked
function changeStatus() {
  //if darkMode was active and this function is called it means the user now wants light
  if (localStorage.getItem("darkMode") === "true") {
    //set to false, to indicate we are in light mode
    localStorage.setItem("darkMode", "false");
    html.removeAttribute("class", "dark");
  } else {
    localStorage.setItem("darkMode", "true"); //same code but adapted for dark theme
    html.setAttribute("class", "dark");
  }
}
// END LOCAL STORAGE for toggle

// local storage for map start
var save = function (city) {
  var new_city = city;

  if (localStorage.getItem("city") === null) {
    localStorage.setItem("city", "false");
  }

  localStorage.setItem("city", new_city);
};

var view = function () {
  var blueMsg = document.querySelector(".msgBlue");
  if (localStorage.getItem("city") !== "false") {
    var savedCity = localStorage.getItem("city");

    getCity(savedCity);
  }
  // alert user on instructions
  if (localStorage.getItem("city") === null) {
    blueAlert.classList.add("show");
    blueAlert.classList.remove("hide");
    blueMsg.innerHTML = `Please enter your city to see if there are any breweries in your area. `;
    // set time out function for alert
    setTimeout(function () {
      blueAlert.classList.add("hide");
      blueAlert.classList.remove("show");
    }, 5000);
  }
};

// local storage for map ends

// Display Modal Alerts Start

// function to display modal alerts
var displayAlert = function (city) {
  var msgSuccess = document.querySelector(".msgSuccess");
  var msgWarning = document.querySelector(".msgWarning");

  if (city) {
    successAlert.classList.remove("hide");
    successAlert.classList.add("show");
    msgSuccess.innerHTML = `Success! We found some breweries in ${city}.`;
  } else {
    warningAlert.classList.remove("hide");
    warningAlert.classList.add("show");
    msgWarning.innerHTML = `Sorry, there are no breweries in your area.`;
  }
};

// functions to delete modal alerts
var removeBlueAlert = function () {
  blueAlert.classList.remove("show");
  blueAlert.classList.add("hide");
};

var removeSuccessAlert = function () {
  successAlert.classList.remove("show");
  successAlert.classList.add("hide");
};

var removeWarningAlert = function () {
  warningAlert.classList.remove("show");
  warningAlert.classList.add("hide");
};

// Display Modal Alerts End

// ** need to debug **
// if location is allowed store accurate current location
/*var successLocation = (position) => {
    console.log(position);
    setupMap([position.coords.longitude, position.coords.latitude]);
};
// block location defaults to San Antonio
var errorLocation = () => {
    setupMap([-98.4936, 29.424349]);
};

// ask user if app will allow location
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
})*/

// mock fetch of api data from brewery api
/*fetch("https://api.openbrewerydb.org/breweries?by_city=san%20antonio").then( (response) => {
    response.json().then( (data) => {

        setupMap(data);

    });
});*/

// call functions
checkStatus();
view();

// Event Listeners
closeBlueBtn.addEventListener("click", removeBlueAlert);
cityform.addEventListener("submit", formSubmit);
closeSuccessBtn.addEventListener("click", removeSuccessAlert);
closeWarningBtn.addEventListener("click", removeWarningAlert);
