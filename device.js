angular.module('device', [])

.factory('on', function ($document) {
  'use strict';
  
  var on = function (eventName, eventListener) {
    $document.on('deviceready', function () {
      $document.on(eventName, eventListener);
    });
  };
  
  return on;
});
