 /*
  * Merge DualMaps + geoMaps Click the map to set a new location for the Street View camera.
  *     todo: Clicks to any map render in street view.
  *     todo: Clicks to any map update all maps 
  *     todo: Clicks to any map update all maps 
  * 
  */

 var map;
 var panorama;
 var hotelSearchMap;
 var infoWindow;
 var countries = {
  'au': {
    center: {lat: -25.3, lng: 133.8},
    zoom: 4
  },
  'br': {
    center: {lat: -14.2, lng: -51.9},
    zoom: 3
  },
  'ca': {
    center: {lat: 62, lng: -110.0},
    zoom: 3
  },
  'fr': {
    center: {lat: 46.2, lng: 2.2},
    zoom: 5
  },
  'de': {
    center: {lat: 51.2, lng: 10.4},
    zoom: 5
  },
  'mx': {
    center: {lat: 23.6, lng: -102.5},
    zoom: 4
  },
  'nz': {
    center: {lat: -40.9, lng: 174.9},
    zoom: 5
  },
  'it': {
    center: {lat: 41.9, lng: 12.6},
    zoom: 5
  },
  'za': {
    center: {lat: -30.6, lng: 22.9},
    zoom: 5
  },
  'es': {
    center: {lat: 40.5, lng: -3.7},
    zoom: 5
  },
  'pt': {
    center: {lat: 39.4, lng: -8.2},
    zoom: 6
  },
  'us': {
    center: {lat: 37.1, lng: -95.7},
    zoom: 3
  },
  'uk': {
    center: {lat: 54.8, lng: -4.6},
    zoom: 5
  }
};


 function initMap() {
   var berkeley = {
     lat: 37.869085,
     lng: -122.254775
   };
   var sv = new google.maps.StreetViewService();

   panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));

   // Set up the map.
   map = new google.maps.Map(document.getElementById('map'), {
     center: berkeley,
     zoom: 16,
     streetViewControl: false
   });


   hotelSearchMap = new google.maps.Map(document.getElementById('hotelSearchMap'), {
     center: {
       lat: -34.397,
       lng: 150.644
     },
     zoom: 13
   });
   infoWindow = new google.maps.InfoWindow();

  //  map = hotelSearchMap;

   // Try HTML5 geolocation.
   if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function (position) {
       var pos = {
         lat: position.coords.latitude,
         lng: position.coords.longitude
       };

       infoWindow.setPosition(pos);
       infoWindow.setContent('Location found.');
       infoWindow.open(hotelSearchMap);
       infoWindow.open(map);
       hotelSearchMap.setCenter(pos);
       map.setCenter(pos);
     }, function () {
       handleLocationError(true, infoWindow, hotelSearchMap.getCenter());
       handleLocationError(true, infoWindow, map.getCenter());
     });
   } else {
     // Browser doesn't support Geolocation
     handleLocationError(false, infoWindow, hotelSearchMap.getCenter());
     handleLocationError(false, infoWindow, map.getCenter());
   }
 

 function handleLocationError(browserHasGeolocation, infoWindow, pos) {
   infoWindow.setPosition(pos);
   infoWindow.setContent(browserHasGeolocation ?
     'Error: The Geolocation service failed.' :
     'Error: Your browser doesn\'t support geolocation.');
   infoWindow.open(hotelSearchMap);
   infoWindow.open(map);
 }

 // Set the initial Street View camera to the center of the map
 sv.getPanorama({
   location: berkeley,
   radius: 50
 }, processSVData);

 // Look for a nearby Street View panorama when the map is clicked.
 // getPanorama will return the nearest pano when the given
 // radius is 50 meters or less.
 map.addListener('click', function (event) {
   sv.getPanorama({
     location: event.latLng,
     radius: 50
   }, processSVData);
 });

 hotelSearchMap.addListener('click', function (event) {
  sv.getPanorama({
    location: event.latLng,
    radius: 50
  }, processSVData);
});


 }

 function processSVData(data, status) {
   if (status === 'OK') {
     var marker = new google.maps.Marker({
       position: data.location.latLng,
       map: map,
       title: data.location.description
     });

     var marker2 = new google.maps.Marker({
      position: data.location.latLng,
      map: hotelSearchMap,
      title: data.location.description
    });

     panorama.setPano(data.location.hotelSearchMap);
     panorama.setPano(data.location.pano);
     panorama.setPov({
       heading: 270,
       pitch: 0
     });
     panorama.setVisible(true);

     marker.addListener('click', function () {
       var markerPanoID = data.location.pano;
       var markerPanoID2 = data.location.hotelSearchMap;
       // Set the Pano to use the passed panoID.
       panorama.setPano(markerPanoID);
       hotelSearchMap.setPano(markerPanoID2);
       panorama.setPov({
         heading: 270,
         pitch: 0
       });
       panorama.setVisible(true);
     });
   } else {
     console.error('Street View data not found for this location.');
   }
 }