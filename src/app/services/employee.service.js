'use strict';

/**
 * http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/
 */
angular.module('resourceadminNg')
    .factory('EmployeeService', function ($http, baseUrlEmployees, $q, $log, Restangular) {

        var Employee = Restangular.all('api/employees');

        var exports = {};

        exports.selectedEmployee = null;

        exports.listEmployees = function () {
            return Employee.getList();
        };

        exports.deleteEmployee = function (employee) {
            return employee.remove();
        };

        exports.createEmployee = function (employee) {
            return Employee.post(employee);
        };

        exports.updateEmployee = function (employee) {
            var employee = Restangular.copy(employee);
            return employee.save();
        };

        exports.listManagers = function () {
            var deferred = $q.defer();
            $http.get(baseUrlEmployees + '/search/searchForManagers', {cache: true}).success(function (data) {

                var employees = data._embedded.employees;
                deferred.resolve(employees);

            }).error(function (msg) {
                deferred.reject(msg);
            });

            return deferred.promise;
        };

        exports.setSelectedEmployee = function (employee) {
            $log.debug('EmployeeService::setting employee: ' + angular.toJson(employee));
            this.selectedEmployee = employee;
        };

        exports.getSelectedEmployee = function () {
            $log.debug('EmployeeService::getting employee: ' + angular.toJson(this.selectedEmployee));
            return this.selectedEmployee;
        };

        return exports;
    });
