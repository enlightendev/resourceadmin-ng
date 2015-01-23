'use strict';

/**
 * @ngdoc function
 * @name userAdminNgApp.controller:EmployeesCtrl
 * @description
 * # EmployeesCtrl
 * Controller of the userAdminNgApp
 */
angular.module('resourceadminNg')

  .controller('RootController', function ($rootScope, $scope, $http, $location, $log) {

    var authenticate = function (callback) {

      $http.get('http://localhost:8080/user').success(function (data) {
        if (data.name) {
          $rootScope.authenticated = true;
        } else {
          $rootScope.authenticated = false;
        }
        callback && callback();
      }).error(function () {
        $rootScope.authenticated = false;
        callback && callback();
      });

    };

    authenticate();

    $scope.credentials = {};

    $scope.login = function () {

      //TODO: move url roots to standard location.
      $http.post('http://localhost:8080/login', $.param($scope.credentials), {
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        }
      }).success(function (data) {
        authenticate(function () {
          if ($rootScope.authenticated) {
            $location.path("/");
            $scope.error = false;
          } else {
            $location.path("/login");
            $scope.error = true;
          }
        });
      }).error(function (data) {
        $location.path("/login");
        $scope.error = true;
        $rootScope.authenticated = false;
      })
    };

    $scope.logout = function() {
      $http.post('logout', {}).success(function() {
        $rootScope.authenticated = false;
        $location.path("/");
      }).error(function(data) {
        $rootScope.authenticated = false;
      });
    }

  });
