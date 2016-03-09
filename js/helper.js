/*

This file contains all of the code running in the background that makes resumeBuilder.js possible. We call these helper functions because they support your code in this course.

Don't worry, you'll learn what's going on in this file throughout the course. You won't need to make any changes to it until you start experimenting with inserting a Google Map in Problem Set 3.

Cameron Pittman
*/


/*
These are HTML strings. As part of the course, you'll be using JavaScript functions
replace the %data% placeholder text you see in them.
*/

var HTMLclear = '<div class="clear"></div>';

var HTMLheaderBox = '<div id="header-box"></div>';
var HTMLheaderName = '<h1 id="name">%data%</h1>';
var HTMLheaderRole = '<div>%data%</div>';
var HTMLheaderText = '<div id="header-text"></div>';

var HTMLcontactGeneric = '<li class="flex-item"><span class="dark-text">%contact%</span><span class="white-text">%data%</span></li>';
var HTMLmobile = '<li class="flex-item"><span class="dark-text">mobile</span><span class="white-text">%data%</span></li>';
var HTMLemail = '<li class="flex-item"><span class="dark-text">email</span><span class="white-text">%data%</span></li>';
var HTMLtwitter = '<li class="flex-item"><span class="dark-text">twitter</span><span class="white-text">%data%</span></li>';
var HTMLgithub = '<li class="flex-item"><span class="dark-text">github</span><span class="white-text">%data%</span></li>';
var HTMLblog = '<li class="flex-item"><span class="dark-text">blog</span><span class="white-text">%data%</span></li>';
var HTMLlocation = '<li class="flex-item"><span class="dark-text">location</span><span class="white-text">%data%</span></li>';

var HTMLwelcomeMsg = '<h2 class="center-text">Welcome!</h2><p id="welcome-message" class="row">%data%</p>';

var HTMLskillsStart = '<div id="skills" class="col-md-3"><h2 id="skills-h3" class="left-text">Skills:</h2><ul id="skillsList"></ul>';
var HTMLskills = '<li><span>%data%</span></li>';

var HTMLworkStart = '<div class="work-entry row"></div>';
var HTMLworkLeft = '<div class="work-left col-md-5"></div>';
var HTMLworkRight = '<div class="work-right col-md-7"></div>';
var HTMLworkEmployer = '<p>%data%</p>';
var HTMLworkTitle = '<p>%data%</p>';
var HTMLworkDates = '<div class="date-text">%data%</div>';
var HTMLworkLocation = '<div class="location-text">%data%</div>';
var HTMLworkDescription = '<li>%data%</li>';

var HTMLprojectStart = '<div class="col-md-4 project-container"><div class="project-entry image-wrapper overlay-fade-in"></div></div>';
var HTMLprojectOverlay = '<div class="project-overlay image-overlay-content"></div>'
var HTMLprojectTitle = '<h2>%data%</h2>';
var HTMLprojectDates = '<div class="white-text">%data%</div>';
var HTMLprojectDescription = '<p>%data%</p>';
var HTMLprojectImage = '<img src="%data%">';
var HTMLprojectLink = '<a href="%data%" class="button">View project</a>'

var HTMLschoolStart = '<div class="education-entry row"></div>';
var HTMLschoolLeft = '<div class="education-left col-md-5"></div>';
var HTMLschoolRight = '<div class="education-right col-md-7"></div>';
var HTMLschoolName = '<p>%data%</p>';
var HTMLschoolDegree = '<p>%data%, ';
var HTMLschoolDates = '<div class="date-text">%data%</div>';
var HTMLschoolLocation = '<div class="location-text">%data%</div>';
var HTMLschoolMajor = '%data%</p>';
var HTMLschoolDescription = '<li>%data%</li>';

var HTMLonlineClasses = '<h3>Online Classes</h3>';
var HTMLonlineTitle = '<p>%data%</p>';
var HTMLonlineSchool = '<p>%data%</p>';
var HTMLonlineDates = '<div class="date-text">%data%</div>';
var HTMLonlineURL = '<a href="#">%data%</a>';

var internationalizeButton = '<button>Internationalize</button>';
var googleMap = '<div id="map"></div>';


/*
The International Name challenge in Lesson 2 where you'll create a function that will need this helper code to run. Don't delete! It hooks up your code to the button you'll be appending.
*/
$(document).ready(function() {
  $('button').click(function() {
    var iName = inName() || function(){};
    $('#name').html(iName);  
  });
});

/*
The next few lines about clicks are for the Collecting Click Locations quiz in Lesson 2.
*/
clickLocations = [];

function logClicks(x,y) {
  clickLocations.push(
    {
      x: x,
      y: y
    }
  );
  console.log('x location: ' + x + '; y location: ' + y);
}

$(document).click(function(loc) {
  var x = loc.pageX;
  var y = loc.pageY;

  logClicks(x, y);
});



/*
This is the fun part. Here's where we generate the custom Google Map for the website.
See the documentation below for more details.
https://developers.google.com/maps/documentation/javascript/reference
*/
var map;    // declares a global map variable


/*
Start here! initializeMap() is called when page is loaded.
*/
function initializeMap() {

  var locations;

  var mapOptions = {
    disableDefaultUI: true
  };

  /* 
  For the map to be displayed, the googleMap var must be
  appended to #mapDiv in resumeBuilder.js. 
  */
  map = new google.maps.Map(document.querySelector('#map'), mapOptions);


  /*
  locationFinder() returns an array of every location string from the JSONs
  written for bio, education, and work.
  */
  function locationFinder() {

    // initializes an empty array
    var locations = [];

    // adds the single location property from bio to the locations array
    locations.push(bio.contacts.location);

    // iterates through school locations and appends each location to
    // the locations array. Note that forEach is used for array iteration
    // as described in the Udacity FEND Style Guide: 
    // https://udacity.github.io/frontend-nanodegree-styleguide/javascript.html#for-in-loop
    education.schools.forEach(function(school){
      locations.push(school.location);
    });

    // iterates through work locations and appends each location to
    // the locations array. Note that forEach is used for array iteration
    // as described in the Udacity FEND Style Guide: 
    // https://udacity.github.io/frontend-nanodegree-styleguide/javascript.html#for-in-loop
    work.jobs.forEach(function(job){
      locations.push(job.location);
    });

    return locations;
  }

  /*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  function createMapMarker(placeData) {

    // The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    map.setMapTypeId(google.maps.MapTypeId.TERRAIN);

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    var infoWindow = new google.maps.InfoWindow({
      content: name
    });

    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map, marker);
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  }

  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
      locations.forEach(function(place){
      // the search request object
      var request = {
        query: place
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, callback);
    });
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  pinPoster(locations);

}

/*
Uncomment the code below when you're ready to implement a Google Map!
*/

// Calls the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
  //Make sure the map bounds get updated on page resize
  map.fitBounds(mapBounds);
});
