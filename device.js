angular.module('device', [])

.factory('on', function ($document) {
  'use strict';
  
  /*
  var on = function (eventName, eventListener) {
    $document.on('deviceready', function () {
      $document.on(eventName, eventListener);
    });
  };
  */
  var on = function (eventName, eventListener) {
    $document.on('deviceready', function () {
      alert('device is ready!');
      $document.on(eventName, function () {
        alert('event fired: ' + eventName);
        eventListener();
      });
    });
  };
  
  return on;
});
