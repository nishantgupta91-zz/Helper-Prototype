/**
 * Created by Nishant on 8/20/2015.
 */
(function(){
    'use strict';

    angular.module('helperApp', ['ngMaterial', 'ngVideo'])
        .controller('helperController', ['$scope', 'video', function($scope, video){
            video.addSource('mp4', 'app/resources/hand.mp4');
        }])
        .controller('demoController', function() {
            this.isDrawingToolOpen = false;
            this.isShapesToolOpen = false;
            this.isTextToolOpen = false;
            this.selectedMode = 'md-fling';
        })
        .directive('headerToolbar', function() {
            return {
                restrict: "E",
                templateUrl: "app/partials/header.html"
            }
        })
        .directive('drawingTools', function() {
            return {
                restrict: "E",
                templateUrl: "app/partials/drawingTools.html"
            }
        })
        .directive('videoPlayer', function() {
            return {
                restrict: "E",
                templateUrl: "app/partials/videoPlayer.html"
            }
        });
})();