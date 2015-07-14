angular.module('device', [])

.factory('on', function ($document, $rootScope) {
  'use strict';
  
  var on = function (eventName, eventListener) {
    $document.on('deviceready', function () {
      $document.on(eventName, function () {
        eventListener();
        $rootScope.$apply();
      });
    });
  };
  
  return on;
});
