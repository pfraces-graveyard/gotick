angular.module('device', [])

.factory('onReady', function ($document, $rootScope) {
  'use strict';
  
  var onReady = function (eventListener) {
    $document.on('deviceready', function () {
      $rootScope.$apply(eventListener);
    });
  };
  
  return onReady;
})

.factory('on', function (onReady) {
  'use strict';
  
  var on = function (eventName, eventListener) {
    onReady(function () {
      $document.on(eventName, eventListener);
    });
  };
  
  return on;
});
