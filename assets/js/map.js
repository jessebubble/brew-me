// selectors
var checkbox =document.querySelector('#toggle')
var html = document.querySelector('html')


// START LOCAL STORAGE
if (localStorage.getItem('darkMode')=== null) {
    localStorage.setItem('darkMode', "false");
}

checkStatus ()

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


mapboxgl.accessToken = 'pk.eyJ1IjoiZm1pbGxzODkiLCJhIjoiY2t3eTM4bmkwMGFvdDMxb2F1ZDhsaGswYiJ9.rbSTg0blKEIsiji9lwSKIw';


setupMap = (center) => {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: center,
        zoom: 15
      });


    const nav = new mapboxgl.NavigationControl()
        map.addControl(nav)

        // toggled dark mode on map
        checkbox.addEventListener('click', function(){
              // if input is checked then set dark mode to map if not set light mode
            checkbox.checked ? map.setStyle('mapbox://styles/mapbox/dark-v10') : map.setStyle('mapbox://styles/mapbox/light-v10')
        })
}


let successLocation = (position) => {
    console.log(position);
    setupMap([position.coords.longitude, position.coords.latitude]);
};

let errorLocation = () => {
    setupMap([29.421, -98.4936]);
};


navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
})

