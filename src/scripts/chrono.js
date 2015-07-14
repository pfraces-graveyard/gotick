angular.module('chrono', [])

.factory('chrono', function () {
  'use strict';
  
  return function () {
    var accrued = 0;
    var start = 0;
    
    var elapsedSince = function (startTime) {
      return Date.now() - startTime;
    };
    
    var startChrono = function () {
      if (start) { return; }
      start = Date.now();
    };
    
    var stopChrono = function () {
      if (!start) { return; }
      accrued += elapsedSince(start);
      start = 0;
    };
    
    var resetChrono = function () {
      accrued = 0;
      start = 0;
    };
    
    var elapsed = function () {
      if (!start) { return accrued; }
      return accrued + elapsedSince(start);
    };
    
    return {
      start: startChrono,
      stop: stopChrono,
      reset: resetChrono,
      elapsed: elapsed
    };
  };
});
