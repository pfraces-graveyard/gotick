angular.module('gotick', ['device', 'chrono'])

.controller('clock', function ($scope, $interval, on, chrono) {
  'use strict';
  
  on('menubutton', function () {
    if ($scope.playing) {
      pauseGame();
      $scope.showMenu = true;
      return;
    }
    
    $scope.showMenu = false;
    resumeGame();
  });
  
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
  
  var resumeGame = function () {
    $scope.playing = true;
    currentPlayer().chrono.start();
    startPollingChrono();
  };
  
  var zeroPad = function (str) {
    str = '' + str;
    return (str.length < 2 ? '0' : '') + str;
  };
  
  var msFmt = function (ms) {
    var acc = ms;
    var miliseconds = acc % 1000;
    acc = (acc - miliseconds) / 1000;
    var seconds = acc % 60;
    acc = (acc - seconds) / 60;
    var minutes = acc % 60;
  
    return zeroPad(minutes) + ':' + zeroPad(seconds);
  };
  
  var switchPlayer = function () {
    if ($scope.playing) {
      currentPlayer().chrono.stop();
      
      if (currentPlayer().periods) {
        currentPlayer().chrono.reset();
      }  
    }
    
    $scope.isBlackPlaying = !$scope.isBlackPlaying;
    
    if ($scope.playing) {
      currentPlayer().chrono.start();
    }
  };
  
  $scope.showMenu = false;
  
  $scope.settings = {
    main: 10, // secoonds
    periods: 5,
    period: 30 // seconds
  };
  
  $scope.msFmt = msFmt;
  $scope.switchPlayer = switchPlayer;
  
  $scope.play = resumeGame;
  $scope.pause = pauseGame;
  $scope.reset = init;
  
  init();
});
