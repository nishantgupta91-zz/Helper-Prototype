/**
 * Created by Nishant on 8/20/2015.
 */

'use strict';

angular.module('helperApp', ['ngMaterial', 'ngVideo'])
    .config(function($mdIconProvider) {
        $mdIconProvider
            .icon('text', 'app/img/icons/underline7.svg', 24)
            .icon('line', 'app/img/icons/horizontal39.svg', 24)
            .icon('circle', 'app/img/icons/circle107.svg', 24)
            .icon('rectangle', 'app/img/icons/photo211.svg', 24)
            .icon('triangle', 'app/img/icons/details.svg', 24)
            .icon('pen', 'app/img/icons/create3.svg', 24)
            .icon('arrow1', 'app/img/icons/call49.svg', 24)
            .icon('arrow2', 'app/img/icons/call47.svg', 24)
            .icon('eraser', 'app/img/icons/eraser.svg', 24)
            .icon('clear', 'app/img/icons/brush1.svg', 24);
    })
    .run(function($http, $templateCache) {
        var urls = [
            'app/img/icons/underline7.svg',
            'app/img/icons/horizontal39.svg',
            'app/img/icons/circle107.svg',
            'app/img/icons/photo211.svg',
            'app/img/icons/details.svg',
            'app/img/icons/create3.svg',
            'app/img/icons/call49.svg',
            'app/img/icons/call47.svg',
            'app/img/icons/eraser.svg',
            'app/img/icons/brush1.svg'
        ];

        angular.forEach(urls, function(url) {
            $http.get(url, {cache: $templateCache});
        });
    });
