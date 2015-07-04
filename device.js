(function () {
  'use strict';
  
  var on = null;
  
  document.addEventListener('deviceready', function () {
    alert('device ready');
    on = document.addEventListener.bind(document);
  });
    
  angular.module('device', [])
  .factory('on', function () {
    return function (eventName, eventListener) {
      on(eventName, eventListener);
    };
  });
})();
