'use strict';

angular.module('resourceadminNg', ['ngAnimate',
  'ngCookies',
  'ngTouch',
  'ngSanitize',
  'restangular',
  'ui.router',
  'ui.grid',
  'ui.grid.edit',
  'ui.grid.selection',
  'ui.bootstrap'
])

  .value('version', 'BETA 0.0.1')

  .constant('baseUrlEmployees', 'http://localhost:8080/employees')
  .constant('baseUrlApplications', 'http://localhost:8080/applications')
  .constant('baseUrlResourcePermissions', 'http://localhost:8080/resourcePermissions')

  .config(function ($stateProvider, $urlRouterProvider, RestangularProvider, $logProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController'
      })

      .state('employees', {
        url: '/employees',
        templateUrl: 'app/employees/employeesMain.html',
        controller: 'EmployeesController'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html'
        //controller: don't need to specify one since logic is contained in root controller
      })

      .state('applications', {
        url: '/applications',
        templateUrl: 'app/applications/applicationsMain.html',
        controller: 'ApplicationsController'
      })
    ;

    RestangularProvider.setResponseInterceptor(
      function(data, operation, what) {
        if (operation === 'getList' && data._embedded) {
          return data._embedded[what];
        }

        if ( operation === 'post' || operation === 'put'){
          return data;
        }

        return []; //maybe we should return data?
      });

    /**
     * this is here to allow grunt serve to work. `Grunt serve` brings the UI up on a server process using port 9000.
     * The application runs on port 8080 and is configured with a CORS filter to accept requests from other domains.
     * This configuration sets up urls to the actual server.
     */
    RestangularProvider.setBaseUrl('http://localhost:8080/');

    /**
     * configure logging
     */
    $logProvider.debugEnabled(true);

    $urlRouterProvider.otherwise('/');
  })
;
