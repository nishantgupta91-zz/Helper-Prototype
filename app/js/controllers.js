/**
 * Created by Nishant on 8/28/2015.
 */
angular.module('mainApp')

    .controller('mainController', ['$scope', 'video', function($scope, video, $q){
        video.addSource('mp4', 'app/resources/hand.mp4');
        $scope.cursorIcon = "";
        console.log('==== main ====');
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