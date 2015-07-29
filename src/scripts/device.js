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

.factory('on', function ($document, $rootScope) {
  'use strict';
  
  var on = function (eventName, eventListener) {
    $document.on('deviceready', function () {
      $document.on(eventName, function () {
        $rootScope.$apply(eventListener);
      });
    });
  };
  
  return on;
});
