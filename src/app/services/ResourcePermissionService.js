'use strict';

/**
 * http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/
 */
angular.module('resourceadminNg')
    .factory('ResourcePermissionService', function ($http, $q, $log, baseUrlResourcePermissions, Restangular) {

        var ResourcePermission = Restangular.all('resourcePermissions');

        var exports = {};

        exports.selectedResourcePermission = null;

        /** CREATE methods  **/
        exports.createResourcePermission = function (resourcePermission) {
            return ResourcePermission.post(resourcePermission);
        };

        /** READ methods  **/
        exports.listResourcePermissions = function () {
            return ResourcePermission.getList();
        };

        /**
         * curl http://localhost:8080/resourcePermissions/search/searchEmployeeId?employeeId=2
         * @param id
         * @returns {jQuery.promise|promise.promise|d.promise|promise|.ready.promise|jQuery.ready.promise|*}
         */
        exports.getResourcePermissionByEmployeeId = function(id) {

            var search = Restangular.allUrl('resourcePermissions', baseUrlResourcePermissions + '/search/searchByEmployeeId?employeeId=' + id);
            return search.getList();

        };

        /** UPDATE methods **/
        exports.updateResourcePermission = function (resourcePermission) {
            return resourcePermission.put();
        };


        /** DELETE methods  **/
        exports.deleteResourcePermission = function (resourcePermission) {
            return resourcePermission.remove();
        };

        exports.setSelectedResourcePermission = function (resourcePermission) {
            this.selectedResourcePermission = resourcePermission;
        };

        exports.getSelectedResourcePermission = function () {
            return this.selectedResourcePermission;
        };

        return exports;

    });
