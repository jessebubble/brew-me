// selectors
var checkbox =document.querySelector('#toggle')
var html = document.querySelector('html')
var cityform = document.getElementById('city-form');
var cityformInput = document.querySelector('#current-location')

mapboxgl.accessToken = 'pk.eyJ1IjoiZm1pbGxzODkiLCJhIjoiY2t3eTM4bmkwMGFvdDMxb2F1ZDhsaGswYiJ9.rbSTg0blKEIsiji9lwSKIw';

// on 'submit' grab city name 
var formSubmit = function (event) {
    event.preventDefault();

    var cityname = cityformInput.value.trim();

    if (cityname) {
    getCityInfo(cityname);

        cityformInput.value = '';
    } else {
        console.log("ENTER VALID CITY");
    }

}

// calling both mapbox and brewery apis at the same time
var getCityInfo = (city) => {
    Promise.all([
        fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/" + city + ".json?access_token=" + mapboxgl.accessToken),
        fetch("https://api.openbrewerydb.org/breweries?by_city=" + city)
    ]).then((responses) => {
        return Promise.all(responses.map((response) => {
            return response.json();
        }))
            }).then((data) => {
            console.log(data);

            // sending data to function setupMap
                setupMap(data);

            }).catch((error) => {
                console.log(error);
            });
}



// START LOCAL STORAGE
if (localStorage.getItem('darkMode')=== null) {
    localStorage.setItem('darkMode', "false");
}

    function checkStatus(){
        if(localStorage.getItem("darkMode")==="true") {
        //the checkbox is checked (if you load the page by default it isn’t)
        toggle.checked = true;
        html.setAttribute('class', 'dark')

        }else{
        toggle.checked = false;
       html.removeAttribute('class','dark')

        }
    }
    // This function gets called every time the checkbox is clicked
    function changeStatus(){   
        //if darkMode was active and this function is called it means the user now wants light                                         
        if (localStorage.getItem('darkMode')==="true"){    
            //set to false, to indicate we are in light mode             
            localStorage.setItem('darkMode', "false");   
            html.removeAttribute('class','dark')

        } else{
            localStorage.setItem('darkMode', "true"); //same code but adapted for dark theme
            html.setAttribute('class', 'dark')
          }
    }
// END LOCAL STORAGE

// function for map
var setupMap = (data) => {

    // grabbing city lng/lat in data
    var cityLng = (data[0].features[0].center[0]);
    var cityLat = (data[0].features[0].center[1]);

    const cityll = new mapboxgl.LngLat(cityLng, cityLat);
    cityll.toArray();
    console.log(cityll);

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: (cityll),
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
    for (var i = 0; i < data[1].length; i++) {
        var lng = (data[1][i].longitude);
        var lat = (data[1][i].latitude);
        console.log(lng, lat);
            
        const ll = new mapboxgl.LngLat(lng, lat);
        ll.toArray();

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
checkStatus()

cityform.addEventListener('submit', formSubmit);

