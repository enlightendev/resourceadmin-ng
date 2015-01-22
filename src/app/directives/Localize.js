// directives for localization
angular.module('resourceadminNg')

    .factory('localize', ['$http', '$rootScope', '$window', function ($http, $rootScope, $window) {
        var localize = {
            currentLocaleData: {},
            currentLang: {},
            setLang: function (lang) {
                $http(
                    {method: 'GET', url: localize.getLangUrl(lang), cache: false}
                ) .success(function (data) {
                        localize.currentLocaleData = data;
                        localize.currentLang = lang;
                        $rootScope.$broadcast('localizeLanguageChanged');
                    }).error(function (data) {
                        console.log('Error updating language!');
                    })
            },
            getLangUrl: function (lang) {
                return 'assets/data/langs/' + lang.langCode + '.json';
            },

            localizeText: function (sourceText) {
                return localize.currentLocaleData[sourceText];
            }
        };

        return localize;
    }])

    .directive('localize', ['localize', function (localize) {
        return {
            restrict: 'A',
            scope: {
                sourceText: '@localize'
            },
            link: function (scope, element, attrs) {
                scope.$on('localizeLanguageChanged', function () {
                    var localizedText = localize.localizeText(scope.sourceText);
                    if (element.is('input, textarea')) element.attr('placeholder', localizedText)
                    else element.text(localizedText);
                });
            }
        }
    }])
;
