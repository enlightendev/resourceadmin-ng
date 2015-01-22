'use strict';

/**
 * @ngdoc function
 * @name userAdminNgApp.controller:EmployeesCtrl
 * @description
 * # EmployeesCtrl
 * Controller of the userAdminNgApp
 */
angular.module('resourceadminNg')

    .factory('settings', ['$rootScope', function($rootScope){
        // supported languages
        var settings = {
            languages: [
                {
                    language: 'English',
                    translation: 'English',
                    langCode: 'en',
                    flagCode: 'us'
                },
                {
                    language: 'Espanish',
                    translation: 'Espanish',
                    langCode: 'es',
                    flagCode: 'es'
                },
                {
                    language: 'German',
                    translation: 'Deutsch',
                    langCode: 'de',
                    flagCode: 'de'
                },
                {
                    language: 'Korean',
                    translation: '한국의',
                    langCode: 'ko',
                    flagCode: 'kr'
                },
                {
                    language: 'French',
                    translation: 'français',
                    langCode: 'fr',
                    flagCode: 'fr'
                },
                {
                    language: 'Portuguese',
                    translation: 'português',
                    langCode: 'pt',
                    flagCode: 'br'
                },
                {
                    language: 'Russian',
                    translation: 'русский',
                    langCode: 'ru',
                    flagCode: 'ru'
                },
                {
                    language: 'Chinese',
                    translation: '中國的',
                    langCode: 'zh',
                    flagCode: 'cn'
                }
            ]
        };

        settings.currentLang = settings.languages[0];

        return settings;

    }])

    .controller('LangController', ['$scope', 'settings', 'localize', function($scope, settings, localize) {
        $scope.languages = settings.languages;
        $scope.currentLang = settings.currentLang;
        $scope.setLang = function(lang) {
            settings.currentLang = lang;
            $scope.currentLang = lang;
            localize.setLang(lang);
        };

        // set the default language
        $scope.setLang($scope.currentLang);

    }])

;
