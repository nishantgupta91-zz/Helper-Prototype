/**
 * Created by Nishant on 8/28/2015.
 */
angular.module('mainApp')

    .controller('mainController', ['$scope', 'video', function($scope, video){
        video.addSource('mp4', 'app/resources/hand.mp4');
        $scope.cursorIcon = "";
        console.log('==== main ====');

        $scope.drawingStyle = "pen";
        $scope.canvasElement = document.getElementById('outputCanvas');
        $scope.ctx = $scope.canvasElement.getContext('2d');
        // variable that decides if something should be drawn on mousemove
        $scope.drawing = false;
        // the last coordinates before the current move
        $scope.lastX;
        $scope.lastY;
        $scope.penClicks = [];
        $scope.drawnLines = [];
        $scope.drawnRectangles = [];
        $scope.mouseDownHandler = function($event) {
            console.log("mouse down ============= ");
            console.log($scope.drawingStyle);
            if($event.offsetX!==undefined){
                $scope.lastX = $event.offsetX;
                $scope.lastY = $event.offsetY;
            } else {
                $scope.lastX = $event.layerX - $event.currentTarget.offsetLeft;
                $scope.lastY = $event.layerY - $event.currentTarget.offsetTop;
            }
            if($scope.drawingStyle == "pen") {
                var penClick = {
                    posX: $scope.lastX,
                    posY: $scope.lastY,
                    drag: false
                };
                $scope.penClicks.push(penClick);
            }
            // begins new line
            $scope.ctx.beginPath();
            $scope.drawing = true;
        };
        $scope.mouseMoveHandler = function($event) {
            if($scope.drawing){
                var currentX = 0;
                var currentY = 0;
                // get current mouse position
                if($event.offsetX!==undefined){
                    currentX = $event.offsetX;
                    currentY = $event.offsetY;
                } else {
                    currentX = $event.layerX - $event.currentTarget.offsetLeft;
                    currentY = $event.layerY - $event.currentTarget.offsetTop;
                }
                if($scope.drawingStyle == "pen") {
                    var penClick = {
                        posX: currentX,
                        posY: currentY,
                        drag: true
                    };
                    $scope.penClicks.push(penClick);
                }
                //$scope.draw($scope.lastX, $scope.lastY, currentX, currentY);
            }
        };
        $scope.mouseUpHandler = function($event) {
            // stop drawing
            $scope.drawing = false;
            var currentX = 0;
            var currentY = 0;
            if($event.offsetX!==undefined){
                currentX = $event.offsetX;
                currentY = $event.offsetY;
            } else {
                currentX = $event.layerX - $event.currentTarget.offsetLeft;
                currentY = $event.layerY - $event.currentTarget.offsetTop;
            }
            if($scope.drawingStyle == "line") {
                var drawnLine = {
                    startX: $scope.lastX,
                    startY: $scope.lastY,
                    endX: currentX,
                    endY: currentY
                };
                $scope.drawnLines.push(drawnLine);
            } else if($scope.drawingStyle == "rectangle") {
                var drawnRectangle = {
                    startX: $scope.lastX,
                    startY: $scope.lastY,
                    sizeX: currentX - $scope.lastX,
                    sizeY: currentY - $scope.lastY
                };
                $scope.drawnRectangles.push(drawnRectangle);
            }
        };
        $scope.reset = function() {
            $scope.canvasElement.width = $scope.canvasElement.width;
        };
        $scope.drawStroke = function() {
            if($scope.drawingStyle == "pen") {
                $scope.ctx.lineTo(currentX, currentY);
                // color
                $scope.ctx.strokeStyle = "#4bf";
                // draw it
                $scope.ctx.stroke();
            }
        };
        $scope.draw = function(startX, startY, currentX, currentY) {
            if($scope.drawingStyle == "pen") {
                $scope.ctx.moveTo(startX, startY);
                $scope.ctx.lineTo(currentX, currentY);
                // color
                $scope.ctx.strokeStyle = "#4bf";
                // draw it
                $scope.ctx.stroke();
            } else if($scope.drawingStyle == "rectangle") {
                $scope.reset();
                for(var i = 0; i < $scope.drawnLines.length; i++) {
                    $scope.ctx.moveTo($scope.drawnLines[i].startX, $scope.drawnLines[i].startY);
                    $scope.ctx.lineTo($scope.drawnLines[i].endX, $scope.drawnLines[i].endY);
                }
                for(var i = 0; i < $scope.drawnRectangles.length; i++) {
                    $scope.ctx.rect($scope.drawnRectangles[i].startX, $scope.drawnRectangles[i].startY,
                        $scope.drawnRectangles[i].sizeX, $scope.drawnRectangles[i].sizeY);
                }
                var sizeX = currentX - startX;
                var sizeY = currentY - startY;

                $scope.ctx.rect(startX, startY, sizeX, sizeY);
                $scope.ctx.lineWidth = 3;
                // color
                $scope.ctx.strokeStyle = '#4bf';
                // draw it
                $scope.ctx.stroke();
            } else if($scope.drawingStyle == "line") {
                $scope.reset();
                for(var i = 0; i < $scope.drawnLines.length; i++) {
                    $scope.ctx.moveTo($scope.drawnLines[i].startX, $scope.drawnLines[i].startY);
                    $scope.ctx.lineTo($scope.drawnLines[i].endX, $scope.drawnLines[i].endY);
                }
                for(var i = 0; i < $scope.drawnRectangles.length; i++) {
                    $scope.ctx.rect($scope.drawnRectangles[i].startX, $scope.drawnRectangles[i].startY,
                        $scope.drawnRectangles[i].sizeX, $scope.drawnRectangles[i].sizeY);
                }
                //ctx.beginPath();
                $scope.ctx.moveTo(startX,startY);
                $scope.ctx.lineTo(currentX, currentY);
                $scope.ctx.lineWidth = 3;
                // color
                $scope.ctx.strokeStyle = '#4bf';
                // draw it
                $scope.ctx.stroke();
            }
        };

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
            var width = ($scope.canvasElement.width)/2;
            var height = ($scope.canvasElement.height)/2;
            if ($scope.ctx) {
                $scope.ctx.drawImage(backgroundObject, 0, 0, width, height);
            }

            var imgData = $scope.ctx.getImageData(0, 0, $scope.canvasElement.width, $scope.canvasElement.height);
            $scope.ctx.putImageData(imgData, 0, 0);
            if($scope.drawingStyle == "pen") {
                for (var i = 1; i < $scope.penClicks.length; i++) {
                    $scope.ctx.beginPath();
                    if ($scope.penClicks[i].drag) {
                        $scope.ctx.moveTo($scope.penClicks[i - 1].posX, $scope.penClicks[i - 1].posY);
                    } else {
                        $scope.ctx.moveTo($scope.penClicks[i].posX - 1, $scope.penClicks[i].posY);
                    }
                    $scope.ctx.lineTo($scope.penClicks[i].posX, $scope.penClicks[i].posY);
                    $scope.ctx.strokeStyle = "#4bf";
                    $scope.ctx.stroke();
                }
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
            $mdBottomSheet.hide(clickedItem);
        };
    });