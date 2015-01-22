'use strict';

/**
 * @ngdoc function
 * @name userAdminNgApp.controller:EmployeesCtrl
 * @description
 * # EmployeesCtrl
 * Controller of the userAdminNgApp
 */
angular.module('resourceadminNg')
    .controller('EmployeesController', function ($scope, EmployeeService, DepartmentService, $log, uiGridConstants) {

        $scope.displayMode = 'list';

        /**
         * https://technpol.wordpress.com/2014/08/23/upgrading-to-ng-grid-3-0-ui-grid/
         * also see applicationList.html where you see "external-scopes="$scope"
         */
        $scope.$scope = $scope;

        $scope.listEmployees = function () {
            $log.debug('EmployeesController::calling listEmployees');

            $scope.gridOptions = {
                enableFiltering: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect: false,
                columnDefs: [
                    {
                        field: 'fname', displayName: 'First Name'},
                    {
                        field: 'lname', displayName: 'Last Name'},
                    {
                        field: 'department', displayName: 'Department',
                        cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                            $log.debug(rowRenderIndex);
                            $log.debug(colRenderIndex);
                            var value = grid.getCellValue(row,col);
                            if (value === 'Human Resources') {
                                return 'blue';
                            }
                        }
                    },
                    {
                        field: 'title', displayName: 'Title',
                        cellTemplate:'<div>{{row.entity[col.field]}}</div>'
                    },
                    {
                        field: 'email', displayName: 'Email',
                        filter: {
                            condition: uiGridConstants.filter.CONTAINS,
                            placeholder: 'contains'
                        }
                    },
                    {
                        name: 'actions', displayName: 'Actions', enableSorting: false, enableFiltering: false,
                        cellTemplate: '' +
                        '<button class="btn btn-primary btn-xs" ng-click="getExternalScopes().editOrCreateEmployee(row.entity)" >E</button> ' +
                        '<button class="btn btn-danger btn-xs" ng-click="getExternalScopes().deleteEmployee(row.entity)" >X</button> '
                    }
                ]
            };

            $scope.gridOptions.onRegisterApi = function(gridApi){
                //set gridApi on scope
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope,function(row){
                    $log.debug('EmployeesController::selected row: ' + angular.toJson(row.entity));
                    EmployeeService.setSelectedEmployee(row.entity);
                });
            };

            EmployeeService.listEmployees().then(function(data){
                $scope.employees = data;
                $scope.gridOptions.data = data;
            });

        };

        $scope.deleteEmployee = function (employee) {

            EmployeeService.deleteEmployee(employee).then(function () {
                $scope.employees.splice($scope.employees.indexOf(employee), 1);
            });

        };

        $scope.createEmployee = function (employee) {

            EmployeeService.createEmployee(employee).then(function (newEmployee) {

                $log.debug('EmployeesController -> EmployeeService::createEmployee: ' + angular.toJson(newEmployee));

                $scope.employees.push(newEmployee);
                $scope.displayMode = 'list';

            });

        };

        $scope.updateEmployee = function (employee) {

            EmployeeService.updateEmployee(employee).then(function (payload) {

                $log.debug('EmployeesController -> EmployeeService::updateEmployee: ' + angular.toJson(payload));

                for (var i = 0; i < $scope.employees.length; i++) {
                    if ($scope.employees[i].id === payload.id) {
                        $scope.employees[i] = payload;
                        break;
                    }
                }

                $scope.displayMode = 'list';
            });
        };

        /**
         * this method is used to bring up the form to create new entity or edit an existing one.
         * @param employee
         */
        $scope.editOrCreateEmployee = function (employee) {

            //set for use in other application areas
            EmployeeService.setSelectedEmployee(employee ? angular.copy(employee) : {});

            //set this var for form
            $scope.currentEmployee = EmployeeService.getSelectedEmployee();

            EmployeeService.listManagers().then(function (data) {
                $scope.managers = data;
            });

            $scope.departments = DepartmentService.listDepartments();
            $scope.displayMode = 'edit';

        };

        $scope.selectEmployee = function (employee) {

            //$scope.selectedEmployee = employee ? angular.copy(employee) : {};
            EmployeeService.setSelectedEmployee(employee ? angular.copy(employee) : {});

        };

        $scope.saveEdit = function (employee) {
            if (angular.isDefined(employee.id)) {
                $scope.updateEmployee(employee);
            } else {
                $scope.createEmployee(employee);
            }
        };

        $scope.cancelEdit = function () {
            //$scope.selectedEmployee = {};
            $scope.displayMode = 'list';
        };

        $scope.getFullNameAndEmail = function (employee) {
            return employee.lname + ', ' + employee.fname + ' (' + employee.email + ')';
        };

        // This method is here so that we can display the full JSON of the passed in object
        // The built in json filter removes anythign starting with a $ so you don't get to see the
        // $dirty, $pristine, etc flags
        $scope.toJSON = function (obj) {
            return JSON.stringify(obj, null, 2);
        };

        $scope.listEmployees();

    });
