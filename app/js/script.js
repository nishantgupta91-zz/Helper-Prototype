/**
 * Created by Nishant on 8/20/2015.
 */
(function(){
    'use strict';

    angular.module('helperApp', ['ngMaterial', 'ngVideo'])
        .controller('helperController', ['$scope', 'video', function($scope, video){
            video.addSource('mp4', 'app/resources/hand.mp4');
        }]);
})();