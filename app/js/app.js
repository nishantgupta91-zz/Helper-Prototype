/**
 * Created by Nishant on 8/20/2015.
 */

'use strict';

angular.module('mainApp', ['ngMaterial', 'ngVideo'])
    .config(function($mdIconProvider) {
        $mdIconProvider
            .icon('text', 'app/img/icons/underline7.svg', 24)
            .icon('line', 'app/img/icons/horizontal39.svg', 24)
            .icon('circle', 'app/img/icons/circle107.svg', 24)
            .icon('rectangle', 'app/img/icons/photo211.svg', 24)
            .icon('triangle', 'app/img/icons/details.svg', 24)
            .icon('pen', 'app/img/icons/create3.svg', 24)
            .icon('eraser', 'app/img/icons/eraser.svg', 24)
            .icon('play', 'app/img/icons/play106.svg', 24)
            .icon('pause', 'app/img/icons/pause44.svg', 24)
            .icon('replay', 'app/img/icons/replay4.svg', 24)
    })
    .run(function($http, $templateCache) {
        var urls = [
            'app/img/icons/underline7.svg',
            'app/img/icons/horizontal39.svg',
            'app/img/icons/circle107.svg',
            'app/img/icons/photo211.svg',
            'app/img/icons/details.svg',
            'app/img/icons/create3.svg',
            'app/img/icons/eraser.svg',
            'app/img/icons/play106.svg',
            'app/img/icons/pause44.svg',
            'app/img/icons/replay4.svg'
        ];

        angular.forEach(urls, function(url) {
            $http.get(url, {cache: $templateCache});
        });
    });
