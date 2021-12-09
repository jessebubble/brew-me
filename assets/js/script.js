
var cityform = document.getElementById('city-form');
var cityformInput = document.querySelector('#submit-btn')



var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityname = cityformInput.value.trim();

    if (cityname) {
        getCity(cityname);

        cityformInput.value = '';
    } else {
        console.log("ENTER VALID CITY");
    }

    
}


var getbylocaltion = function (latitude,longitude) {
    var requestUrl = 'https://api.openbrewerydb.org/breweries?by_dist=' + latitude + longitude;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data, latitude, longitude);
        })
    
}










var getCity = function(city) {
    var requestUrl = 'https://api.openbrewerydb.org/breweries?by_city=' + city;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data, city);
        })
    
}

