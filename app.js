angular.module('SmashBoard', []).controller('TvController', function($scope, $http) {
  var now = Math.floor(new Date().getTime() / 1000);
  var url = 'http://redape.cloudapp.net/tvguidea/singleslot/'+now+'?channels=[1,159,63,64]&format=json&o=1'
  var ajaxPromise = $http.get(url);
  ajaxPromise.then(function weGotData(response) {
    $scope.channels = response.data.events;
  });
  // This controller will use a custom promise object used to set the coordinates
}).controller('LocationController', function($scope, $q) {
  // A deferred object used to represent getting the location by an asynchronous call
  var getGeo = $q.defer();
  window.navigator.geolocation.getCurrentPosition(function(geo) {
    // This only gets called once the position is returned as 'geo', a.k.a. the callback function
    getGeo.resolve(geo);
  })
  // The 'then' function only gets called once the 'promise' is fullfilled (above) after resolve gets the value of 'geo'
  getGeo.promise.then(function(geoposition) {
    // Assigning the coordinates returned from 'getCurrentPosition' to the $scope
    $scope.coordinates = geoposition.coords;
  });
});
