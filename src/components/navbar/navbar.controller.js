'use strict';

angular.module('resourceadminNg')
  .controller('NavbarCtrl', function ($scope, $http) {
    $scope.date = new Date();

    $http.get('/resource/').success(function(data) {
      $scope.greeting = data;
    });
  });
