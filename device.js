angular.module('device', [])

.factory('on', function () {
  'use strict';
  
  /*
  var on = function (eventName, eventListener) {
    $document.on('deviceready', function () {
      $document.on(eventName, eventListener);
    });
  };
  */
  var on = function (eventName, eventListener) {
    alert('registering event listener for: ' + eventName)
    document.addEventListener('deviceready', function () {
      alert('device is ready!');
      document.addEventListener(eventName, function () {
        alert('event fired: ' + eventName);
        eventListener();
      });
    });
  };
  
  return on;
});
