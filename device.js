angular.module('device', [])

.factory('on', function ($document) {
  'use strict';
  
  var on = function (eventName, eventListener) {
    $document.on('deviceready', function () {
      alert('device ready');
      $document.on(eventName, function () {
        alert(eventName);
        eventListener();
      });
    });
  };
  
  return on;
});
