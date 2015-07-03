angular.module('gotick', ['chrono'])

.controller('clock', function ($scope, $interval, chrono) {
  'use strict';

  var initPlayer = function (name) {
    $scope[name] = {
      elapsed: 0,
      periods: 0,
      chrono: chrono()
    };
  };
  
  var init = function () {
    $scope.playing = false;
    $scope.isBlackPlaying = true;
    
    initPlayer('black');
    initPlayer('white');
  };
  
  var currentPlayer = function () {
    return $scope[$scope.isBlackPlaying ? 'black' : 'white'];
  };
  
  var pollingChrono = null;
  
  var startPollingChrono = function () {
    pollingChrono = $interval(function () {
      var player = currentPlayer();
      player.elapsed = player.chrono.elapsed();
    }, 200);
  };
  
  var stopPollingChrono = function () {
    $interval.cancel(pollingChrono);
  };
  
  var zeroPad = function (str) {
    str = '' + str;
    return (str.length < 2 ? '0' : '') + str;
  };
  
  var milisecondsToTime = function (miliseconds) {
    var acc = miliseconds;
    var ms = acc % 1000;
    acc = (acc - ms) / 1000;
    var secs = acc % 60;
    acc = (acc - secs) / 60;
    var mins = acc % 60;
  
    return zeroPad(mins) + ':' + zeroPad(secs);
  };
  
  $scope.settings = {
    main: 10, // secoonds
    periods: 5,
    period: 30 // seconds
  };
  
  $scope.reset = init;
  
  $scope.clockFmt = function (elapsed) {
    var total = $scope.settings.main * 60 * 1000;
    return milisecondsToTime(total - elapsed);
  };
  
  $scope.play = function () {
    $scope.playing = true;
    currentPlayer().chrono.start();
    startPollingChrono();
  };
  
  $scope.pause = function () {
    $scope.playing = false;
    currentPlayer().chrono.stop();
    stopPollingChrono();
  };
});
