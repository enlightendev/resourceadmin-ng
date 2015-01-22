'use strict';

/**
 *
 */
angular.module('resourceadminNg')

  .factory('DepartmentService', function(){

    var departments = [
      {
        name: 'Information Technology',
        description:' '
      },
      {
        name: 'Human Resources',
        description:' '
      },
      {
        name: 'Marketing',
        description:' '
      }
    ];

    return {
      listDepartments: function(){
        return departments;
      }
    };
  });
