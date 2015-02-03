'use strict';

/**
 *
 */
angular.module('resourceadminNg')
    .factory('httpRequestResponseViewer', function ($q, $location) {
        var httpViewer = {
            request: function(config) {
                console.log(config);
                return config;
            },

            response: function(response) {
                console.log('Response', response.status, 'status');
                if (response.status == 302) {
                    $location.url('/login');
                }
                return response;
            },

            responseError: function (rejection) {
                console.log('Failed with', rejection.status, 'status');
                if (rejection.status == 403) {
                    $location.url('/login');
                }
                return $q.reject(rejection);
            }
        };
        return httpViewer;
    });
