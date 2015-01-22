'use strict';

/**
 * @ngdoc function
 * @name userAdminNgApp.controller:ApplicationController
 * @description
 * # ApplicationController
 * Controller of the userAdminNgApp
 */
angular.module('resourceadminNg')
    .controller('ApplicationsController', function ($scope, ApplicationService, DepartmentService, $log, uiGridConstants) {
        $scope.displayMode = 'list';

        /**
         * https://technpol.wordpress.com/2014/08/23/upgrading-to-ng-grid-3-0-ui-grid/
         * also see applicationList.html where you see "external-scopes="$scope"
         */
        $scope.$scope = $scope;

        $scope.listApplications = function () {
            $log.debug('ApplicationsController::calling listApplications');

            $scope.gridOptions = {
                enableFiltering: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect: false,
                columnDefs: [
                    {
                        field: 'name', displayName: 'Name'},
                    {
                        field: 'appType', displayName: 'Type'},
                    {
                        field: 'homePage', displayName: 'Home Page'
                    },
                    {
                        field: 'technicalOwner', displayName: 'Tech Owner'
                    },
                    {
                        name: 'actions', displayName: 'Actions', enableSorting: false, enableFiltering: false,
                        cellTemplate: '' +
                        '<button class="btn btn-primary btn-xs" ng-click="getExternalScopes().editOrCreateApplication(row.entity)" >E</button> ' +
                        '<button class="btn btn-danger btn-xs" ng-click="getExternalScopes().deleteApplication(row.entity)" >X</button> '
                    }
                ]
            };

            $scope.gridOptions.onRegisterApi = function(gridApi){
                //set gridApi on scope
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope,function(row){
                    $log.debug('ApplicationsController::selected row: ' + angular.toJson(row.entity));
                    ApplicationService.setSelectedApplication(row.entity);
                });
            };

            ApplicationService.listApplications().then(function(data){
                $scope.applications = data;
                $scope.gridOptions.data = data;
            });

        };

        $scope.deleteApplication = function (application) {

            ApplicationService.deleteApplication(application).then(function () {
                $scope.applications.splice($scope.applications.indexOf(application), 1);
            });

        };

        $scope.createApplication = function (application) {

            ApplicationService.createApplication(application).then(function (newApplication) {

                $log.debug('ApplicationsController -> ApplicationService::createApplication: ' + angular.toJson(newApplication));

                $scope.applications.push(newApplication);
                $scope.displayMode = 'list';

            });

        };

        $scope.updateApplication = function (application) {

            ApplicationService.updateApplication(application).then(function (payload) {

                $log.debug('ApplicationsController -> ApplicationService::updateApplication: ' + angular.toJson(payload));

                for (var i = 0; i < $scope.applications.length; i++) {
                    if ($scope.applications[i].id === payload.id) {
                        $scope.applications[i] = payload;
                        break;
                    }
                }

                $scope.displayMode = 'list';
            });
        };

        /**
         * this method is used to bring up the form to create new entity or edit an existing one.
         * @param application
         */
        $scope.editOrCreateApplication = function (application) {

            //set for use in other application areas
            ApplicationService.setSelectedApplication(application ? angular.copy(application) : {});

            //set this var for form
            $scope.currentApplication = ApplicationService.getSelectedApplication();
            $scope.displayMode = 'edit';

        };

        $scope.selectApplication = function (application) {

            //$scope.selectedApplication = application ? angular.copy(application) : {};
            ApplicationService.setSelectedApplication(application ? angular.copy(application) : {});

        };

        $scope.saveEdit = function (application) {
            if (angular.isDefined(application.id)) {
                $scope.updateApplication(application);
            } else {
                $scope.createApplication(application);
            }
        };

        $scope.cancelEdit = function () {
            //$scope.selectedApplication = {};
            $scope.displayMode = 'list';
        };

        $scope.getFullNameAndEmail = function (application) {
            return application.lname + ', ' + application.fname + ' (' + application.email + ')';
        };

        // This method is here so that we can display the full JSON of the passed in object
        // The built in json filter removes anythign starting with a $ so you don't get to see the
        // $dirty, $pristine, etc flags
        $scope.toJSON = function (obj) {
            return JSON.stringify(obj, null, 2);
        };

        $scope.listApplications();

    })

;
