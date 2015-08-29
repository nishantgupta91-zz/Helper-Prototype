/**
 * Created by Nishant on 8/28/2015.
 */
angular.module('helperApp')
    .controller('helperController', ['$scope', 'video', function($scope, video){
        video.addSource('mp4', 'app/resources/hand.mp4');
    }])
    .controller('toolboxController', function($scope, $timeout, $mdBottomSheet) {
        $scope.alert = '';

        $scope.showGridBottomSheet = function($event) {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'bottom-sheet-grid-template.html',
                controller: 'GridBottomSheetCtrl',
                targetEvent: $event
            }).then(function(clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };
    })
    .controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
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

        $scope.listItemClick = function($index) {
            var clickedItem = $scope.items[$index];
            //document.body.style.cursor = 'url(' + clickedItem.icon + '), auto';
            $mdBottomSheet.hide(clickedItem);
        };
    });