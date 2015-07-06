angular.module('touch', [])

.directive('touchStart', function ($parse) {
  'use strict';

  var link = function (scope, element, attr) {
    var expr = $parse(attr.touchStart);

    element.on('touchstart mousedown', function (event) {
      alert('touchstart or mousedown');
      scope.$apply(function () {
        expr(scope, { $event: event });
      });
    });
  };

  return {
    link: link
  };
});
