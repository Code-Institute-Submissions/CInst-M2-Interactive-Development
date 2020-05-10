 /*
  * Merge DualMaps + geoMaps Click the map to set a new location for the Street View camera.
  *     todo: Clicks to any map render in street view.
  * 
  */

 var map;
 var panorama;
 var hotelSearchMap;
 var infoWindow;

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
     zoom: 6
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