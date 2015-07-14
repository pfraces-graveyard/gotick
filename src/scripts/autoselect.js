angular.module('autoselect', [])

.directive('autoselect', function () {
  'use strict';

  return {
    link: function (scope, element, attrs) {
      element.on('click', function () {
        this.select();
      });
    }
  };
});
