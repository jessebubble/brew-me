// selectors
var checkbox = document.querySelector('#toggle')
var html = document.querySelector('html')

// toggle between light and dark mode for the html page function
var toggleDarkMode = function(){
    // if input is checked then set dark mode if not set light mode
  checkbox.checked ? html.setAttribute('class', 'dark'): html.removeAttribute('class','dark')
}

// call function
toggleDarkMode()

// event listenter to click checkbox
checkbox.addEventListener('click', toggleDarkMode)


mapboxgl.accessToken = 'pk.eyJ1IjoiZm1pbGxzODkiLCJhIjoiY2t3eTM4bmkwMGFvdDMxb2F1ZDhsaGswYiJ9.rbSTg0blKEIsiji9lwSKIw';


setupMap = (lng, lat) => {

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

    const ll = new mapboxgl.LngLat(lng, lat);
    console.log(ll);
    ll.toArray();
        
    // Create a new marker.
    const marker = new mapboxgl.Marker()
    .setLngLat(ll)
    .addTo(map);

}


var successLocation = (position) => {
    console.log(position);
    setupMap([position.coords.longitude, position.coords.latitude]);
};

var errorLocation = () => {
    setupMap([-98.4936, 29.424349]);
};


navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
})


fetch("https://api.openbrewerydb.org/breweries?by_city=san%20antonio").then( (response) => {
    response.json().then( (data) => {
        console.log(data);

    for (i = 0; i < data.length; i++) {
        var lng = (data[i].longitude);
        var lat = (data[i].latitude);

        setupMap(lng, lat);
    }
    });
});


