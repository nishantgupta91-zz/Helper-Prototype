/**
 * Created by Nishant on 8/28/2015.
 */
angular.module('mainApp')
    .controller('mainController', ['$scope', 'video', 'toolsService', function($scope, video, toolsService){
        $scope.resourceDir = 'app/resources/';
        $scope.cursorIcon = "";
        console.log('==== main ====');
        $scope.drawingStyle = "Pen";
        $scope.canvasElement = document.getElementById('outputCanvas');
        $scope.ctx = $scope.canvasElement.getContext('2d');
        // variable that decides if something should be drawn on mousemove
        $scope.drawing = false;
        // the last coordinates before the current move
        $scope.lastX;
        $scope.lastY;
        $scope.penClicks = [];
        $scope.tempLines = [];
        $scope.drawnLines = [];
        $scope.tempRectangles = [];
        $scope.drawnRectangles = [];
        $scope.tempCircles = [];
        $scope.drawnCircles = [];
        $scope.videoName;

        $scope.openFileDialog = function(){
            document.getElementById('upload').click();
        };
        $scope.getVideoFile = function() {
            $scope.videoName = document.getElementById('upload').value;
            var nameSplit = $scope.videoName.split("\\");
            $scope.videoName = nameSplit[nameSplit.length - 1];
            video.addSource('mp4', $scope.resourceDir + $scope.videoName);
        };

        $scope.mouseDownHandler = function($event) {
            if(toolsService.getTool() != null) {
                $scope.drawingStyle = toolsService.getTool().name;
            }
            console.log($scope.drawingStyle);
            if($event.offsetX!==undefined){
                $scope.lastX = $event.offsetX;
                $scope.lastY = $event.offsetY;
            } else {
                $scope.lastX = $event.layerX - $event.currentTarget.offsetLeft;
                $scope.lastY = $event.layerY - $event.currentTarget.offsetTop;
            }
            if($scope.drawingStyle.toLowerCase() == "pen") {
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
                if($scope.drawingStyle.toLowerCase() == "pen") {
                    var penClick = {
                        posX: currentX,
                        posY: currentY,
                        drag: true
                    };
                    $scope.penClicks.push(penClick);
                } else if($scope.drawingStyle.toLowerCase() == "rectangle") {
                    var drawnRectangle = {
                        startX: $scope.lastX,
                        startY: $scope.lastY,
                        sizeX: currentX - $scope.lastX,
                        sizeY: currentY - $scope.lastY
                    };
                    $scope.tempRectangles.push(drawnRectangle);
                } else if($scope.drawingStyle.toLowerCase() == "line") {
                    var drawnLine = {
                        startX: $scope.lastX,
                        startY: $scope.lastY,
                        endX: currentX,
                        endY: currentY
                    };
                    $scope.tempLines.push(drawnLine);
                } else if($scope.drawingStyle.toLowerCase() == "circle") {
                    var drawnCircle = {
                        startX: $scope.lastX,
                        startY: $scope.lastY,
                        endX: currentX,
                        endY: currentY
                    };
                    $scope.tempCircles.push(drawnCircle);
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
            if($scope.drawingStyle.toLowerCase() == "line") {
                var drawnLine = {
                    startX: $scope.lastX,
                    startY: $scope.lastY,
                    endX: currentX,
                    endY: currentY
                };
                $scope.drawnLines.push(drawnLine);
            } else if($scope.drawingStyle.toLowerCase() == "rectangle") {
                var drawnRectangle = {
                    startX: $scope.lastX,
                    startY: $scope.lastY,
                    sizeX: currentX - $scope.lastX,
                    sizeY: currentY - $scope.lastY
                };
                $scope.drawnRectangles.push(drawnRectangle);
            } else if($scope.drawingStyle.toLowerCase() == "circle") {
                var drawnCircle = {
                    startX: $scope.lastX,
                    startY: $scope.lastY,
                    endX: currentX,
                    endY: currentY
                };
                $scope.drawnCircles.push(drawnCircle);
            }
        };
        $scope.reset = function() {
            $scope.canvasElement.width = $scope.canvasElement.width;
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
            var width = ($scope.canvasElement.width);
            var height = ($scope.canvasElement.height);
            if ($scope.ctx) {
                $scope.ctx.drawImage(backgroundObject, 0, 0, width, height);
            }

            var imgData = $scope.ctx.getImageData(0, 0, $scope.canvasElement.width, $scope.canvasElement.height);
            $scope.ctx.putImageData(imgData, 0, 0);
            $scope.ctx.beginPath();

            // freehand pen drawing
            for (var i = 1; i < $scope.penClicks.length; i++) {
                if ($scope.penClicks[i].drag) {
                    $scope.ctx.moveTo($scope.penClicks[i - 1].posX, $scope.penClicks[i - 1].posY);
                } else {
                    $scope.ctx.moveTo($scope.penClicks[i].posX - 1, $scope.penClicks[i].posY);
                }
                $scope.ctx.lineTo($scope.penClicks[i].posX, $scope.penClicks[i].posY);
                $scope.ctx.strokeStyle = "#4bf";
                $scope.ctx.stroke();
            }

            // rectangles
            var numberOfTempRectangles = $scope.tempRectangles.length;
            if(numberOfTempRectangles > 0) {
                $scope.ctx.rect($scope.tempRectangles[numberOfTempRectangles - 1].startX,
                    $scope.tempRectangles[numberOfTempRectangles - 1].startY,
                    $scope.tempRectangles[numberOfTempRectangles - 1].sizeX,
                    $scope.tempRectangles[numberOfTempRectangles - 1].sizeY);
                $scope.ctx.strokeStyle = "#4bf";
                $scope.ctx.stroke();
            }
            for (var i = 0; i < $scope.drawnRectangles.length; i++) {
                $scope.ctx.rect($scope.drawnRectangles[i].startX, $scope.drawnRectangles[i].startY,
                    $scope.drawnRectangles[i].sizeX, $scope.drawnRectangles[i].sizeY);
                $scope.ctx.strokeStyle = "#4bf";
                $scope.ctx.stroke();
            }

            // lines
            var numberOfTempLines = $scope.tempLines.length;
            if(numberOfTempLines > 0) {
                console.log('startX '+$scope.tempLines[numberOfTempLines - 1].startX);
                console.log('endX '+$scope.tempLines[numberOfTempLines - 1].endX);
                $scope.ctx.moveTo($scope.tempLines[numberOfTempLines - 1].startX, $scope.tempLines[numberOfTempLines - 1].startY);
                $scope.ctx.lineTo($scope.tempLines[numberOfTempLines - 1].endX, $scope.tempLines[numberOfTempLines - 1].endY);
                $scope.ctx.strokeStyle = "#4bf";
                $scope.ctx.stroke();
            }
            for (var i = 0; i < $scope.drawnLines.length; i++) {
                $scope.ctx.moveTo($scope.drawnLines[i].startX, $scope.drawnLines[i].startY);
                $scope.ctx.lineTo($scope.drawnLines[i].endX, $scope.drawnLines[i].endY);
                $scope.ctx.strokeStyle = "#4bf";
                $scope.ctx.stroke();
            }

            // circles
            var numberOfTempCircles = $scope.tempCircles.length;
            if(numberOfTempCircles > 0) {
                console.log('startX '+$scope.tempCircles[numberOfTempCircles - 1].startX);
                console.log('endX '+$scope.tempCircles[numberOfTempCircles - 1].endX);
                var radiusX = ($scope.tempCircles[numberOfTempCircles - 1].endX - $scope.tempCircles[numberOfTempCircles - 1].startX) * 0.5;
                var radiusY = ($scope.tempCircles[numberOfTempCircles - 1].endY - $scope.tempCircles[numberOfTempCircles - 1].startY) * 0.5;
                var centerX = $scope.tempCircles[numberOfTempCircles - 1].startX + radiusX;
                var centerY = $scope.tempCircles[numberOfTempCircles - 1].startY + radiusY;
                var step = 0.01;
                var a = step;
                var pi2 = Math.PI * 2 - step;
                $scope.ctx.moveTo(centerX + radiusX * Math.cos(0), centerY + radiusY * Math.sin(0));
                for (; a < pi2; a += step) {
                    $scope.ctx.lineTo(centerX + radiusX * Math.cos(a), centerY + radiusY * Math.sin(a));
                }
                $scope.ctx.closePath();
                $scope.ctx.strokeStyle = "#4bf";
                $scope.ctx.stroke();
            }
            for (var i = 0; i < $scope.drawnCircles.length; i++) {
                var radiusX = ($scope.drawnCircles[i].endX - $scope.drawnCircles[i].startX) * 0.5;
                var radiusY = ($scope.drawnCircles[i].endY - $scope.drawnCircles[i].startY) * 0.5;
                var centerX = $scope.drawnCircles[i].startX + radiusX;
                var centerY = $scope.drawnCircles[i].startY + radiusY;
                var step = 0.01;
                var a = step;
                var pi2 = Math.PI * 2 - step;
                //$scope.ctx.beginPath();
                $scope.ctx.moveTo(centerX + radiusX * Math.cos(0), centerY + radiusY * Math.sin(0));
                for (; a < pi2; a += step) {
                    $scope.ctx.lineTo(centerX + radiusX * Math.cos(a), centerY + radiusY * Math.sin(a));
                }
                $scope.ctx.closePath();
                $scope.ctx.strokeStyle = '#4bf';
                $scope.ctx.stroke();
            }
        };
    }])

    .controller('toolboxController', function($scope, $mdBottomSheet, toolsService) {
        console.log("======== toolbox =============");
        $scope.setTool = function(tool) {
            toolsService.setTool(tool);
        };
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
                    $scope.setTool($scope.cursorIcon);
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