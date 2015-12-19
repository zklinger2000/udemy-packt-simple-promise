angular.module('SmashBoard', []).controller('TvController', function($scope, $http) {
  // This controller is using the predefined AngularJS $http.get(), which is using promises
  var now = Math.floor(new Date().getTime() / 1000);
  var url = 'http://redape.cloudapp.net/tvguidea/singleslot/'+now+'?channels=[1,159,63,64]&format=json&o=1'
  // This is creating a deferred object to represent the channel data that will be returned from GET
  var ajaxPromise = $http.get(url);
  // Only after this object has the data, will then call this callback function with the 
  // resolved promise as the data (here it is called 'response', but the name doesn't matter)
  ajaxPromise.then(function weGotData(response) {
    // Assign the data from the events object to the $scope
    $scope.channels = response.data.events;
  });
  
  // This controller will use a custom promise object used to set the coordinates
}).controller('LocationController', function($scope, LocationService) {
  // Use this service to get the coordinates from the browser
  LocationService.getGeolocation().then(function(geoposition) {
    // Assigning the coordinates returned from 'getGeolocation()' to the $scope
    $scope.coordinates = geoposition.coords;
  });
  
  // Here we put the code for getting the geolocation data into a separate service, although
  // we could have left it in the controller above, we want to have slim, modular/reusable code
}).factory('LocationService', function($q) {
  return {
    // Returns the Geoposition Object from the browser's getCurrentPosition() call.
    // Notice this function is callback-based.
    getGeolocation: function() {
      // A deferred object used to represent getting the location by an asynchronous call
      var getGeo = $q.defer();
      window.navigator.geolocation.getCurrentPosition(function(geo) {
        // This only gets called once the position is returned as 'geo', a.k.a. the callback function
        getGeo.resolve(geo);
      });
      // Returning the outcome of 'getCurrentPosition()'
      return getGeo.promise;
    }
  }
});

// This will use the browser-native function .getBattery() which returns a 
// Promise object where only Resolve needs to be handled.
document.addEventListener('DOMContentLoaded', function(event) {
  var charging = document.getElementById('charging');
  var level = document.getElementById('battery-level');
  // Getting the battery Promise
  // According to the docs, getBattery() always returns only a resolved promise (not a rejected one, ever)
  //var batteryPromise = navigator.getBattery();
  navigator.getBattery().then(function(batteryManager) {
    console.log(batteryManager);
    charging.innerText = batteryManager.charging ? 'Yes' : 'No';
    level.innerText = (batteryManager.level * 100) + '%';
    level.className = 'fa fa-battery-' + Math.round(batteryManager.level * 4);
  });
});

// Another Promise using mouse click events with multiple outcomes
document.addEventListener('DOMContentLoaded', function(event) {
  var click = document.getElementById('click-me');
  var last = document.getElementById('last');
  
  click.addEventListener('mousedown', function() {
    // Create a Promise Object
    var clicking = new Promise(function executor(resolve, reject) {
      var start = new Date(); // a Date representing now
      // Add event listener for mousing 'out' of the DOM element
      click.onmouseout = function() {
        console.debug('Mouse out');
        reject('You left the button');
      };
      // Add event listener for releasing the mouse click
      click.onmouseup = function() {
        console.debug('Mouse out');
        resolve(new Date() - start);
      };
    });
    // Handle the outcome of our Promise.  It gets passed what we gave to 
    // resolve() above, here we're calling it 'duration'
    clicking.then(function(duration) {
      // Set the element's text to the time that had elapsed when you released the mouse click
      last.innerText = (duration/1000) + ' seconds';
      // this is the failure, or the 2nd callback the above Promise Object expects as 'reject'
    }, function(message) {
      window.alert('Challenge incomplete');
    });
  });
});

// Add an Event Listener to use a pure Javascript promise Object
document.addEventListener('DOMContentLoaded', function() {
  // Assigning the element with id='say-what'
  var input = document.getElementById('say-what');
  // Assigning the element with id='status'
  var output = document.getElementById('status');
  // Adding a listener for 'blur' to trigger this callback
  input.addEventListener('blur', function() {
    console.debug('Exited input');
    // Create our promise Object
    // The function called here could be anonymous,
    // it does not need to be called executor.
    var speaking = new Promise(function executor(success, failure) {
      // Create an Object that will be a sound from the passed in String we type into the input
      var msg = new SpeechSynthesisUtterance(input.value);
      // This promise Object is event based, not callback.  Notice we're assigning a function to 
      // the 'event' onend. It will get passed an event object once completed.
      msg.onend = success;
      /* Below is a longer way to write the success callback.  Above we don't need the () backets
       * to call the function because it will be invoked when the callback gets called from the Promise
      msg.onend = function(event) {
        // calling the first callback
        success(event);
      };
      */
      // This plays the message
      speechSynthesis.speak(msg);
    });
    // To display on screen while the sound is playing
    output.innerText = 'Speaking';
    // Do something once 'speaking' has played and its promise is resolved
    speaking.then(function(event) {
      console.debug(event);
      output.innerText = 'Speech completed in ' + (event.elapsedTime / 1000) + ' seconds';
    });
  });
  
});