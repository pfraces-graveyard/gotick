(function () {
  'use strict';
  
  var on = null;
  
  document.addEventListener('deviceready', function () {
    alert('device ready');
    on = document.addEventListener.bind(document);
  });
    
  angular.module('device', []).factory('on', function () {
    
    /*
    var on = function (eventName, eventListener) {
      $document.on('deviceready', function () {
        $document.on(eventName, eventListener);
      });
    };
    */
    var on = function (eventName, eventListener) {
      on(eventName, eventListener);
    };
    
    return on;
  });
})();
