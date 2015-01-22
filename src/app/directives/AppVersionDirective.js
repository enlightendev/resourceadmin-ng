'use strict';

/**
 *
 * simple directive to display app version anywhere it is needed.
 * 'version' is injected and defined in app.js
 *
 */
angular.module('resourceadminNg')
  .directive('appVersion', function(version){
    return function(scope, elm){
      elm.text(version);
    };
  });
