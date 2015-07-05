angular.module('gotick', ['device', 'chrono'])

.controller('clock', function ($scope, $interval, on, chrono) {
  'use strict';
  
  var exit = function () {
    navigator.app.exitApp();
  };

  var background = function () {
    navigator.Backbutton.goHome();
  };

  var beep = function () {
    navigator.vibrate(100);
  };
  
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
    $scope.gameOver = false;
    $scope.playing = true;
    $scope.showMenu = false;
    $scope.showSettings = true;
    $scope.isBlackPlaying = true;
    $scope.initialMove = true;
    
    initPlayer('black');
    initPlayer('white');
  };
  
  var newGame = function () {
    init();
    $scope.showSettings = false;
  };
  
  var pollingChrono = null;
  
  var stopPollingChrono = function () {
    $interval.cancel(pollingChrono);
  };
  
  var pauseGame = function () {
    $scope.playing = false;
    if ($scope.initialMove) { return; }
    
    currentPlayer().chrono.stop();
    stopPollingChrono();
  };
  
  var startPollingChrono = function () {
    pollingChrono = $interval(function () {
      var player = currentPlayer();
      
      if (player.remainingTime() <= 0) {
        if (!player.remainingPeriods()) {
          $scope.gameOver = true;
          pauseGame();
          return;
        }
        
        player.periods += 1;
        player.chrono.reset();
        player.chrono.start();
        beep();
      }
    }, 200);
  };
  
  var resumeGame = function () {
    if ($scope.gameOver) { return; }

    $scope.playing = true;
    if ($scope.initialMove) { return; }
    
    currentPlayer().chrono.start();
    startPollingChrono();
  };
  
  var togglePause = function () {
    if ($scope.showSettings) {
      return;
    }
    
    if ($scope.gameOver) {
      $scope.showMenu = true;
      return;
    }

    if (!$scope.initialMove) { beep(); }
    
    if ($scope.playing) {
      pauseGame();
      $scope.showMenu = true;
      return;
    }
    
    $scope.showMenu = false;
    resumeGame();
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
    beep();
    
    if ($scope.initialMove) {
      $scope.initialMove = false;
      $scope.isBlackPlaying = !$scope.isBlackPlaying;
      resumeGame();
      return;
    }
    
    currentPlayer().chrono.stop();
    if (currentPlayer().periods) { currentPlayer().chrono.reset(); }
    $scope.isBlackPlaying = !$scope.isBlackPlaying;
    currentPlayer().chrono.start();
  };
  
  $scope.settings = {
    main: 10, // secoonds
    periods: 5,
    period: 30 // seconds
  };
  
  $scope.msFmt = msFmt;
  $scope.switchPlayer = switchPlayer;
  $scope.reset = init;
  $scope.newGame = newGame;
  $scope.exit = exit;
  
  init();
  on('menubutton', togglePause);
  
  on('backbutton', function () {
    if ($scope.showMenu) {
      togglePause();
      return;
    }
    
    if (!$scope.playing || $scope.initialMove) {
      exit();
      return;
    }
    
    background();
  });
});
