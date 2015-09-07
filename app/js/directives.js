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
                name: "="
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
    })
    .directive('manageTimeUpdate', function ($window, $timeout) {
        return {
            scope: {
                videoCurrentTime: "=videoCurrentTime"
            },
            controller: function ($scope, $element) {

                $scope.onTimeUpdate = function () {
                    var currTime = $element[0].currentTime;
                    if (currTime - $scope.videoCurrentTime > 0.5 || $scope.videoCurrentTime - currTime > 0.5) {
                        $element[0].currentTime = $scope.videoCurrentTime;
                    }
                    $scope.$apply(function () {
                        $scope.videoCurrentTime = $element[0].currentTime;
                    });
                }
            },
            link: function (scope, elm) {
                // Use this $watch to restart the video if it has ended
                scope.$watch('videoCurrentTime', function (newVal) {

                    if (elm[0].ended) {
                        // Do a second check because the last 'timeupdate'
                        // after the video stops causes a hiccup.
                        if (elm[0].currentTime !== newVal) {
                            elm[0].currentTime = newVal;
                            elm[0].play();
                        }
                    }
                });
                // Otherwise keep any model syncing here.
                elm.bind('timeupdate', scope.onTimeUpdate);
            }
        }
    });