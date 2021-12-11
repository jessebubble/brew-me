// selectors
var checkbox = document.querySelector('#toggle')
var html = document.querySelector('html')
var cityform = document.getElementById('city-form');
var cityformInput = document.querySelector('#current-location')

mapboxgl.accessToken = 'pk.eyJ1IjoiZm1pbGxzODkiLCJhIjoiY2t3eTM4bmkwMGFvdDMxb2F1ZDhsaGswYiJ9.rbSTg0blKEIsiji9lwSKIw';

// on 'submit' grab city name 
var formSubmit = function (event) {
    event.preventDefault();

    var cityname = cityformInput.value.trim();

    if (cityname) {
        getCity(cityname);

        cityformInput.value = '';
    } else {
        console.log("ENTER VALID CITY");
    }

}

// based on user input - pull data for cities breweries
var getCity = function(city) {
    var requestUrl = 'https://api.openbrewerydb.org/breweries?by_city=' + city;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // callback function for setupMap and pass data/city 
            setupMap(data, city);
        })
}

// toggle between light and dark mode for the html page function
var toggleDarkMode = function(){
    // if input is checked then set dark mode if not set light mode
  checkbox.checked ? html.setAttribute('class', 'dark'): html.removeAttribute('class','dark')
}


// function for map
var setupMap = (data, city) => {

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-98.4936, 29.424349],
        zoom: 8
      })

    const nav = new mapboxgl.NavigationControl()
        map.addControl(nav)

        // toggled dark mode on map
        checkbox.addEventListener('click', function(){
              // if input is checked then set dark mode to map if not set light mode
            checkbox.checked ? map.setStyle('mapbox://styles/mapbox/dark-v10') : map.setStyle('mapbox://styles/mapbox/light-v10')
        })
    // iterating through data long/lat to display markers
    for (var i = 0; i < data.length; i++) {
        var lng = (data[i].longitude);
        var lat = (data[i].latitude);
            
        const ll = new mapboxgl.LngLat(lng, lat);
        ll.toArray();
        console.log(ll);

    // Create a new marker.
        const marker = new mapboxgl.Marker()
            .setLngLat(ll)
            .addTo(map);
    }
}

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

// call function
toggleDarkMode()

// event listenter to click checkbox
checkbox.addEventListener('click', toggleDarkMode)

cityform.addEventListener('submit', formSubmit);

