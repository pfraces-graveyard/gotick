angular.module('notifications', ['device'])

.factory('beep', function (onReady) {
  'use strict';
  
  var snd = null;
  
  onReady(function () {
    snd = new Media('/android_asset/www/sounds/beep.mp3');
  });
    
  var beep = function () {
    if (!snd) { return; }
    snd.play();
  };
  
  return beep;
})

.factory('vibrate', function () {
  'use strict';
  
  var vibrate = function () {
    navigator.vibrate(1);
  };
  
  return vibrate;
});
