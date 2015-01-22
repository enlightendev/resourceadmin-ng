'use strict';

/**
 * http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/
 */
angular.module('resourceadminNg')
    .factory('ApplicationService', function ($http, baseUrlApplications, $q, $log, Restangular) {

        var Application = Restangular.all('applications');

        var exports = {};

        exports.selectedApplication = null;

        exports.listApplications = function () {
            return Application.getList();
        };

        exports.deleteApplication = function (application) {
            return application.remove();
        };

        exports.createApplication = function (application) {
            return Application.post(application);
            //return $http.post(baseUrlApplications, application);
        };

        exports.updateApplication = function (application) {
            var application = Restangular.copy(application);
            return application.save();
        };

        exports.setSelectedApplication = function (application) {
            $log.debug('ApplicationService::setting application: ' + angular.toJson(application));
            this.selectedApplication = application;
        };

        exports.getSelectedApplication = function () {
            $log.debug('ApplicationService::getting application: ' + angular.toJson(this.selectedApplication));
            return this.selectedApplication;
        };

        return exports;
    });
