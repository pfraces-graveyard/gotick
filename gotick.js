angular.module('gotick', ['chrono'])

.controller('clock', function ($scope, $interval, chrono) {
  'use strict';
  
  var currentPlayer = function () {
    return $scope[$scope.isBlackPlaying ? 'black' : 'white'];
  };
  
  var remainingTimeFn = function (player) {
    return function () {
      var mainTime = $scope.settings.main * 60 * 1000;
      var periodTime = $scope.settings.period * 1000;
      var turnTime = player.periods ? periodTime : mainTime;
      return turnTime - player.chrono.elapsed();
    };
  };
  
  var remainingPeriodsFn = function (player) {
    return function () {
      return $scope.settings.periods - player.periods;
    };
  };

  var initPlayer = function (name) {
    var player = $scope[name] = {
      elapsed: 0,
      periods: 0,
      chrono: chrono()
    };
    
    player.remainingTime = remainingTimeFn(player);
    player.remainingPeriods = remainingPeriodsFn(player);
  };
  
  var init = function () {
    $scope.playing = false;
    $scope.isBlackPlaying = true;
    
    initPlayer('black');
    initPlayer('white');
  };
  
  var pollingChrono = null;
  
  var stopPollingChrono = function () {
    $interval.cancel(pollingChrono);
  };
  
  var pauseGame = function () {
    $scope.playing = false;
    currentPlayer().chrono.stop();
    stopPollingChrono();
  };
  
  var startPollingChrono = function () {
    pollingChrono = $interval(function () {
      var player = currentPlayer();
      
      if (player.remainingTime() <= 0) {
        if (!player.remainingPeriods()) {
          pauseGame();
          return;
        }
        
        player.periods += 1;
        player.chrono.reset();
        player.chrono.start();
      }
    }, 200);
  };
  
  $scope.settings = {
    main: 10, // secoonds
    periods: 5,
    period: 30 // seconds
  };
  
  $scope.reset = init;
  
  $scope.msFmt = (function () {
    var zeroPad = function (str) {
      str = '' + str;
      return (str.length < 2 ? '0' : '') + str;
    };
  
    return function (ms) {
      var acc = ms;
      var miliseconds = acc % 1000;
      acc = (acc - miliseconds) / 1000;
      var seconds = acc % 60;
      acc = (acc - seconds) / 60;
      var minutes = acc % 60;
    
      return zeroPad(minutes) + ':' + zeroPad(seconds);
    };
  })();
  
  $scope.play = function () {
    $scope.playing = true;
    currentPlayer().chrono.start();
    startPollingChrono();
  };
  
  $scope.pause = pauseGame;
  
  $scope.switchPlayer = function () {
    if ($scope.playing) { currentPlayer().chrono.stop(); }
    $scope.isBlackPlaying = !$scope.isBlackPlaying;
    if ($scope.playing) { currentPlayer().chrono.start(); }
  };
  
  init();
});
