/**
 * Created by Nishant on 8/28/2015.
 */
angular.module('mainApp')
    .directive('headerToolbar', function() {
        return {
            restrict: "E",
            templateUrl: "app/partials/header.html"
        }
    })
    .directive('myToolbox', function() {
        return {
            restrict: "E",
            $scope: {
                name: "=",
                toolboxAlert: "="
            },
            templateUrl: "app/partials/toolbox.html",
            controller: "toolboxController"
        }
    })
    .directive('videoPlayer', function() {
        return {
            restrict: "E",
            templateUrl: "app/partials/videoPlayer.html"
        }
    });