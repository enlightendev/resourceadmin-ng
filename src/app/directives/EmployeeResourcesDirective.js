'use strict';

/**
 *
 */
angular.module('resourceadminNg')

    /**
     * controllers in this file are specifically for the directives defined in this file.
     */

    /*
     * This controller is used by the employeeResources directive.
     */
    .controller('EmployeeResourceController', function($scope, EmployeeService, ResourcePermissionService, $log){

        $scope.displayMode = 'viewResourcePermissions';

        $scope.permissions = [];

        $scope.selectResourcePermission = function (resource) {
            $log.debug('employeeResourcesDirective::selectResourcePermission: ' + angular.toJson(resource));
        };

        $scope.deleteResourcePermission = function (resource) {

            resource.remove().then(function(){

                $log.debug('employeeResourcesDirective::deleteResourcePermission: ' + angular.toJson(resource));
                //TODO: remove from local array instead of making another rest call to update
                ResourcePermissionService.getResourcePermissionByEmployeeId(EmployeeService.selectedEmployee.id).then(function(data){
                    $scope.permissions=data;
                });
            });
        };

        $scope.createResourcePermission = function(resourcePermission){

            /**
             * TODO: review this for cleaner alternative.
             * we have to do some transformation
             * @type {string}
             */
            resourcePermission.employee = '/api/employees/' + EmployeeService.getSelectedEmployee().id;
            resourcePermission.resourceName = resourcePermission.permission.resourceName;
            resourcePermission.resourceType = resourcePermission.permission.resourceType;
            resourcePermission.permission = resourcePermission.permission.permission;

            ResourcePermissionService.createResourcePermission(resourcePermission).then(function (newResourcePermission) {

                $scope.permissions.push(newResourcePermission);
                $scope.displayMode = 'viewResourcePermissions';
                $scope.resourcePermission = {};

            })
        };

        $scope.newResourcePermission = function () {
            $log.debug('employeeResourcesDirective::newResourcePermission for employee: ' + angular.toJson(EmployeeService.getSelectedEmployee()));
            $scope.displayMode = 'editResourcePermissions';

            $scope.all_permissions = [
                {id: 1, permission: 'trx-premium', description: 'allow premium', tags:'admin', resourceName: 'solar', resourceType: 'application'},
                {id: 2, permission: 'api-read-cases', description: 'allow case read', tags:'admin', resourceName: 'solar', resourceType: 'api'},
                {id: 3, permission: 'api-delete-cases', description: 'allow case read', tags:'admin', resourceName: 'solar', resourceType: 'api'},
                {id: 4, permission: 'api-delete-fund', description: 'delete fund', tags: 'fmdb', resourceName: 'fmdb', resourceType: 'api'},
                {id: 5, permission: 'search-employee', description: 'search for employees', tags: 'api', resourceName: 'employee-admin', resourceType: 'api'}
            ];

            $scope.resourcePermission = {};
        };

        $scope.cancelEdit = function(){
            $scope.displayMode = 'viewResourcePermissions';
            $scope.resourcePermission = {};
        };

        $scope.saveEdit = function (resourcePermission) {
            if (angular.isDefined(resourcePermission.id)) {
                $scope.updateResourcePermission(resourcePermission);
            } else {
                $scope.createResourcePermission(resourcePermission);
            }
        };
    })

    /**
     * this directive handles the employee's resource permissions view.
     */
    .directive('employeeResources', function ($log, EmployeeService, ResourcePermissionService) {

        return {
            restrict: 'A',
            scope: {},
            templateUrl: 'app/directives/employeeResources.tmpl.html',
            controllerAs: 'EmployeeResourceController',

            /**
             * At a higher level, both link and controller do the same thing, the main difference is that controller
             * can expose an API while link will interact with the controller.
             */
            controller: 'EmployeeResourceController',

            /**
             * The link option is used when you would like to modify the DOM.
             *
             * At a higher level, both link and controller do the same thing, the main difference is that controller
             * can expose an API while link will interact with the controller.
             *
             * @param scope = This is the AngularJS scope within the directive
             * @param element = This is the element name that the directive maps to
             * @param attributes = This is the attribute names along with their values
             */
            link: function (scope, element, attributes) {

                $log.debug('employeeResourcesDirective::link -> scope: ' + scope + ' element: ' + element + ' attributes: ' + attributes);

                /**
                 * Listen to changes in employee selection ( from data grid). When that happens we need to update
                 * other areas of the UI.
                 */
                scope.$watch(function(){return EmployeeService.selectedEmployee;}, function(newValue, oldValue, scope) {

                    if(newValue && newValue.id){
                        ResourcePermissionService.getResourcePermissionByEmployeeId(newValue.id).then(function(data){
                            scope.permissions=data;
                        });
                    }
                });
            }
        };
    });
