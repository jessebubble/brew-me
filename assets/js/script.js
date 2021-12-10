
var cityform = document.getElementById('city-form');
var cityformInput = document.querySelector('#current-location')



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

var getCity = function(city) {
    var requestUrl = 'https://api.openbrewerydb.org/breweries?by_city=' + city;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data, city);
            for (i = 0; i < data.length; i++) {
                var breweryname = ([data[i].name]);
                var longlat = ([data[i].longitude, data[i].latitude]);
                console.log(breweryname + "\n" + longlat);

            }
        })
        
}

/*var getbylocation = function () {
    var requestUrl = 'https://api.openbrewerydb.org/breweries?by_dist=' + coords;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
    
}*/











cityform.addEventListener('submit', formSubmit);