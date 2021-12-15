// selectors
var checkbox =document.querySelector('#toggle')
var html = document.querySelector('html')
var cityform = document.getElementById('city-form');
var cityformInput = document.querySelector('#current-location')
var warningAlert = document.querySelector('#warningAlert')
var closeWarningAlert = document.querySelector('.close-warning-btn')
var successAlert = document.querySelector('#successAlert')
var closeSuccessAlert = document.querySelector('.close-success-btn')

mapboxgl.accessToken = 'pk.eyJ1IjoiZm1pbGxzODkiLCJhIjoiY2t3eTM4bmkwMGFvdDMxb2F1ZDhsaGswYiJ9.rbSTg0blKEIsiji9lwSKIw';

// on 'submit' grab city name 
var formSubmit = function (event) {
    event.preventDefault();

    var cityname = cityformInput.value.trim();

    if (cityname) {
    getCityInfo(cityname);
    save(cityname);
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

            // sending data to function setupMap and to displayAlert
                setupMap(data);
                displayAlert(data)
            }).catch((error) => {
                console.log(error);
            });

}

// Display Modal Alerts Start
var displayAlert = function(data){
  var dataLength = data[1].length;
  var dataCity = data[0].query.join(' ');
  var msgSuccess = document.querySelector(".msgSuccess");
  var msgWarning = document.querySelector(".msgWarning");

  if (dataLength && localStorage.getItem("city")) {
    successAlert.classList.remove("hide");
    successAlert.classList.add("show");
    msgSuccess.innerHTML = `Success! We found ${dataLength} breweries in ${dataCity}.`;
    setTimeout(function(){
      successAlert.classList.remove("show");
      successAlert.classList.add("hide");
    }, 6000)
  } else {
    warningAlert.classList.remove("hide");
    warningAlert.classList.add("show");
    msgWarning.innerHTML = `Please enter a city to see if there are any breweries in your area.`;
    setTimeout(function(){
      warningAlert.classList.remove("show");
      warningAlert.classList.add("hide");
    }, 6000)
  }
}

// functions to delete modal alerts
var removeSuccessAlert = function () {
  successAlert.classList.remove("show");
  successAlert.classList.add("hide");
};

var removeWarningAlert = function () {
  warningAlert.classList.remove("show");
  warningAlert.classList.add("hide");
};


// Display Modal Alerts End

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
        style: 'mapbox://styles/mapbox/dark-v10',
        center: (cityll),
        zoom: 10
      })

    const nav = new mapboxgl.NavigationControl()
        map.addControl(nav)


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
       .setPopup(
         new mapboxgl.Popup({ offset: 25 }) // add popups
           .setHTML(
             `<h2>${data[1][i].name}</h2>` +
               `<h2>${data[1][i].street}</h2>` +
               `<h2>${data[1][i].postal_code}</h2>`+
              `<h2>${data[1][i].state}</h2>` +
              `<a href=${data[1][i].website_url}>${data[1][i].website_url}</a>`              
           )
       )
       .addTo(map);
    }
}



// START LOCAL STORAGE FOR TOGGLE DARKMODE
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
// END LOCAL STORAGE FOR TOGGLE DARKMODE


// local storage for map start
var save = function (city) {
var new_city = city;

if (localStorage.getItem("city") === null) {
  localStorage.setItem("city", "false");
}

localStorage.setItem("city", new_city);

};

var view = function () {
if (localStorage.getItem("city") !== "false") {
  var savedCity = localStorage.getItem("city");

  getCityInfo(savedCity);
}

};

// local storage for map ends

// call function 
checkStatus()
view()

// Event Listeners
cityform.addEventListener('submit', formSubmit);
closeSuccessAlert.addEventListener("click", removeSuccessAlert);
closeWarningAlert.addEventListener("click", removeWarningAlert);
