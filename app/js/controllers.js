/**
 * Created by Nishant on 8/28/2015.
 */
angular.module('mainApp')

    .controller('mainController', ['$scope', 'video', function($scope, video){
        video.addSource('mp4', 'app/resources/hand.mp4');
        $scope.cursorIcon = "";
        console.log('==== main ====');
        $scope.drawCanvas = function() {
            if (window.requestAnimationFrame) window.requestAnimationFrame($scope.drawCanvas);
            // IE implementation
            else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame($scope.drawCanvas);
            // Firefox implementation
            else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame($scope.drawCanvas);
            // Chrome implementation
            else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame($scope.drawCanvas);
            // Other browsers that do not yet support feature
            else setTimeout($scope.drawCanvas, 16.7);
            $scope.drawVideoOnCanvas();
        };
        $scope.drawVideoOnCanvas = function() {
            var backgroundObject = document.getElementById("videoBackgrounddata");
            var canvas = document.getElementById("outputCanvas");
            var width = canvas.width;
            var height = canvas.height;
            if (canvas.getContext) {
                var context = canvas.getContext('2d');
                context.drawImage(backgroundObject, 0, 0, width, height);
                //var imgBackgroundData = context.getImageData(0, 0, width, height);
                //var imgData = context.createImageData(width, height);
                //context.putImageData(imgData, 0, 0);
            }
        };
    }])

    .controller('toolboxController', function($scope, $mdBottomSheet) {
        console.log("======== toolbox =============");
        $scope.toolboxAlert = '';
        $scope.cursorIcon = '';
        console.log($scope.toolboxAlert);
        $scope.showToolbox = function($event) {
            $scope.toolboxAlert = '';
            $scope.cursorIcon = '';
            $mdBottomSheet
                .show({
                    templateUrl: 'app/partials/toolboxGrid.html',
                    controller: 'toolboxGridController',
                    targetEvent: $event
                })
                .then(function(clickedItem) {
                    $scope.toolboxAlert = clickedItem.name + ' clicked!';
                    $scope.cursorIcon = clickedItem;
                });
        };
    })

    .controller('toolboxGridController', function($scope, $mdBottomSheet) {
        $scope.items = [
            { name: 'Pen', icon: 'pen' },
            { name: 'Circle', icon: 'circle' },
            { name: 'Line', icon: 'line' },
            { name: 'Rectangle', icon: 'rectangle' },
            { name: 'Triangle', icon: 'triangle' },
            { name: 'Text', icon: 'text' },
            { name: 'Up Arrow', icon: 'arrow1' },
            { name: 'Down Arrow', icon: 'arrow2' },
            { name: 'Eraser', icon: 'eraser' },
            { name: 'Clear', icon: 'clear' }
        ];
        $scope.toolClicked = function($index) {
            var clickedItem = $scope.items[$index];
            //document.body.style.cursor = 'url(' + clickedItem.icon + '), auto';
            $mdBottomSheet.hide(clickedItem);
        };
    });