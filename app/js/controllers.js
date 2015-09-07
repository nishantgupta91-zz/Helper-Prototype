/**
 * Created by Nishant on 8/28/2015.
 */
angular.module('mainApp')
    .controller('mainController', ['$scope', 'video', 'toolsService', '$mdBottomSheet', function($scope, video, toolsService, $mdBottomSheet){
        $scope.resourceDir = 'app/resources/';
        //$scope.clearOption = "";
        console.log('==== main ====');
        $scope.canvasElement = document.getElementById('outputCanvas');
        $scope.ctx = $scope.canvasElement.getContext('2d');
        // variable that decides if something should be drawn on mousemove
        $scope.drawing = false;
        $scope.drawingStyle = "Pen";
        $scope.strokeColor = 'black';
        $scope.brushThickness = 1;
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
        $scope.tempTriangles = [];
        $scope.drawnTriangles = [];
        $scope.videoName;
        $scope.Math = window.Math;

        $scope.openFileDialog = function(){
            document.getElementById('upload').click();
        };
        $scope.getVideoFile = function() {
            $scope.videoName = document.getElementById('upload').value;
            var nameSplit = $scope.videoName.split("\\");
            $scope.videoName = nameSplit[nameSplit.length - 1];
            video.addSource('mp4', $scope.resourceDir + $scope.videoName);
        };
        $scope.clearDrawings = function() {
            $scope.tempCircles = [];
            $scope.tempTriangles = [];
            $scope.tempLines = [];
            $scope.tempRectangles = [];
            $scope.drawnCircles = [];
            $scope.drawnTriangles = [];
            $scope.drawnLines = [];
            $scope.drawnRectangles = [];
            $scope.penClicks = [];
        };
        $scope.clearPenDrawings = function() {
            $scope.penClicks = [];
        };
        $scope.clearLineDrawings = function() {
            $scope.tempLines = [];
            $scope.drawnLines = [];
        };
        $scope.clearRectangleDrawings = function() {
            $scope.tempRectangles = [];
            $scope.drawnRectangles = [];
        };
        $scope.clearTriangleDrawings = function() {
            $scope.tempTriangles = [];
            $scope.drawnTriangles = [];
        };
        $scope.clearCircleDrawings = function() {
            $scope.tempCircles = [];
            $scope.drawnCircles = [];
        };
        $scope.mouseDownHandler = function($event) {
            if(toolsService.getTool() != null) {
                $scope.drawingStyle = toolsService.getTool().name;
            }
            if(toolsService.getColor() != null) {
                $scope.strokeColor = toolsService.getColor().color;
            }
            if(toolsService.getBrushThickness() != null) {
                $scope.brushThickness = toolsService.getBrushThickness();
            }
            console.log("************************************");
            console.log($scope.drawingStyle);
            console.log($scope.strokeColor);
            console.log($scope.brushThickness);
            console.log("************************************");
            if($event.offsetX!==undefined){
                $scope.lastX = $event.offsetX;
                $scope.lastY = $event.offsetY;
            } else {
                $scope.lastX = $event.layerX - $event.currentTarget.offsetLeft;
                $scope.lastY = $event.layerY - $event.currentTarget.offsetTop;
            }
            var color = $scope.strokeColor;
            var thickness = $scope.brushThickness;
            if($scope.drawingStyle.toLowerCase() == "pen") {
                var penClick = {
                    posX: $scope.lastX,
                    posY: $scope.lastY,
                    drag: false,
                    color: color,
                    thickness: thickness
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
                var color = $scope.strokeColor;
                var thickness = $scope.brushThickness;
                console.log("$scope.strokeColor ************** : " + color);
                console.log("$scope.brushThickness ************** : " + thickness);
                if($scope.drawingStyle.toLowerCase() == "pen") {
                    var penClick = {
                        posX: currentX,
                        posY: currentY,
                        drag: true,
                        color: color,
                        thickness: thickness
                    };
                    $scope.penClicks.push(penClick);
                } else if($scope.drawingStyle.toLowerCase() == "rectangle") {
                    var drawnRectangle = {
                        startX: $scope.lastX,
                        startY: $scope.lastY,
                        sizeX: currentX - $scope.lastX,
                        sizeY: currentY - $scope.lastY,
                        color: color,
                        thickness: thickness
                    };
                    $scope.tempRectangles.push(drawnRectangle);
                } else if($scope.drawingStyle.toLowerCase() == "line") {
                    var drawnLine = {
                        startX: $scope.lastX,
                        startY: $scope.lastY,
                        endX: currentX,
                        endY: currentY,
                        color: color,
                        thickness: thickness
                    };
                    $scope.tempLines.push(drawnLine);
                } else if($scope.drawingStyle.toLowerCase() == "circle") {
                    var drawnCircle = {
                        startX: $scope.lastX,
                        startY: $scope.lastY,
                        endX: currentX,
                        endY: currentY,
                        color: color,
                        thickness: thickness
                    };
                    $scope.tempCircles.push(drawnCircle);
                } else if($scope.drawingStyle.toLowerCase() == "triangle") {
                    var drawnTriangle = {
                        startX: $scope.lastX,
                        startY: $scope.lastY,
                        endX: currentX,
                        endY: currentY,
                        thirdX: $scope.lastX + 2*(currentX - $scope.lastX),
                        thirdY: $scope.lastY,
                        color: color,
                        thickness: thickness
                    };
                    $scope.tempTriangles.push(drawnTriangle);
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
            var color = $scope.strokeColor;
            var thickness = $scope.brushThickness;
            if($scope.drawingStyle.toLowerCase() == "line") {
                var drawnLine = {
                    startX: $scope.lastX,
                    startY: $scope.lastY,
                    endX: currentX,
                    endY: currentY,
                    color: color,
                    thickness: thickness
                };
                $scope.drawnLines.push(drawnLine);
            } else if($scope.drawingStyle.toLowerCase() == "rectangle") {
                var drawnRectangle = {
                    startX: $scope.lastX,
                    startY: $scope.lastY,
                    sizeX: currentX - $scope.lastX,
                    sizeY: currentY - $scope.lastY,
                    color: color,
                    thickness: thickness
                };
                $scope.drawnRectangles.push(drawnRectangle);
            } else if($scope.drawingStyle.toLowerCase() == "circle") {
                var drawnCircle = {
                    startX: $scope.lastX,
                    startY: $scope.lastY,
                    endX: currentX,
                    endY: currentY,
                    color: color,
                    thickness: thickness
                };
                $scope.drawnCircles.push(drawnCircle);
            } else if($scope.drawingStyle.toLowerCase() == "triangle") {
                var drawnTriangle = {
                    startX: $scope.lastX,
                    startY: $scope.lastY,
                    endX: currentX,
                    endY: currentY,
                    thirdX: $scope.lastX + 2*(currentX - $scope.lastX),
                    thirdY: $scope.lastY,
                    color: color,
                    thickness: thickness
                };
                $scope.drawnTriangles.push(drawnTriangle);
            }
        };

        $scope.reset = function() {
            $scope.canvasElement.width = $scope.canvasElement.width;
        };

        $scope.drawCanvas = function() {
            console.log("currentTime **************** : " + $scope.currentTime);
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
            console.log("drawing video on canvas : ");
            $scope.ctx.putImageData(imgData, 0, 0);
            $scope.ctx.beginPath();
            $scope.drawPenStrokes();
            $scope.drawRectangleStrokes();
            $scope.drawLineStrokes();
            $scope.drawTriangleStrokes();
            $scope.drawCircleStrokes();
        };

        // freehand pen drawing
        $scope.drawPenStrokes = function() {
            for (var i = 1; i < $scope.penClicks.length; i++) {
                $scope.ctx.beginPath();
                if ($scope.penClicks[i].drag) {
                    $scope.ctx.moveTo($scope.penClicks[i - 1].posX, $scope.penClicks[i - 1].posY);
                } else {
                    $scope.ctx.moveTo($scope.penClicks[i].posX - 1, $scope.penClicks[i].posY);
                }
                $scope.ctx.lineTo($scope.penClicks[i].posX, $scope.penClicks[i].posY);
                //$scope.ctx.strokeStyle = $scope.strokeColor;// "#4bf";
                console.log("$scope.penClicks.length : " + $scope.penClicks.length);
                $scope.ctx.lineWidth = $scope.penClicks[i].thickness;
                $scope.ctx.strokeStyle = $scope.penClicks[i].color;
                $scope.ctx.stroke();
            }
            if($scope.penClicks > 0)
                console.log("penClicks : " + $scope.penClicks[2].color);
        };
        // lines
        $scope.drawLineStrokes = function() {
            $scope.ctx.beginPath();
            var numberOfTempLines = $scope.tempLines.length;
            if(numberOfTempLines > 0) {
                $scope.ctx.moveTo($scope.tempLines[numberOfTempLines - 1].startX, $scope.tempLines[numberOfTempLines - 1].startY);
                $scope.ctx.lineTo($scope.tempLines[numberOfTempLines - 1].endX, $scope.tempLines[numberOfTempLines - 1].endY);
                //$scope.ctx.strokeStyle = $scope.strokeColor;//"#4bf";
                $scope.ctx.lineWidth = $scope.tempLines[numberOfTempLines - 1].thickness;
                $scope.ctx.strokeStyle = $scope.tempLines[numberOfTempLines - 1].color;
                $scope.ctx.stroke();
            }
            for (var i = 0; i < $scope.drawnLines.length; i++) {
                $scope.ctx.beginPath();
                $scope.ctx.moveTo($scope.drawnLines[i].startX, $scope.drawnLines[i].startY);
                $scope.ctx.lineTo($scope.drawnLines[i].endX, $scope.drawnLines[i].endY);
                //$scope.ctx.strokeStyle = $scope.strokeColor;//"#4bf";
                $scope.ctx.lineWidth = $scope.drawnLines[i].thickness;
                $scope.ctx.strokeStyle = $scope.drawnLines[i].color;
                $scope.ctx.stroke();
            }
        };
        // circles
        $scope.drawCircleStrokes = function() {
            $scope.ctx.beginPath();
            var numberOfTempCircles = $scope.tempCircles.length;
            if(numberOfTempCircles > 0) {
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
                $scope.ctx.lineWidth = $scope.tempCircles[numberOfTempCircles - 1].thickness;
                $scope.ctx.strokeStyle = $scope.tempCircles[numberOfTempCircles - 1].color;//"#4bf";
                $scope.ctx.stroke();
            }
            for (var i = 0; i < $scope.drawnCircles.length; i++) {
                $scope.ctx.beginPath();
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
                $scope.ctx.lineWidth = $scope.drawnCircles[i].thickness;
                $scope.ctx.strokeStyle = $scope.drawnCircles[i].color;//'#4bf';
                $scope.ctx.stroke();
            }
        };
        // triangles
        $scope.drawTriangleStrokes = function() {
            $scope.ctx.beginPath();
            var numberOfTempTriangles = $scope.tempTriangles.length;
            if(numberOfTempTriangles > 0) {
                $scope.ctx.moveTo($scope.tempTriangles[numberOfTempTriangles - 1].startX, $scope.tempTriangles[numberOfTempTriangles - 1].startY);
                $scope.ctx.lineTo($scope.tempTriangles[numberOfTempTriangles - 1].endX, $scope.tempTriangles[numberOfTempTriangles - 1].endY);
                $scope.ctx.lineTo($scope.tempTriangles[numberOfTempTriangles - 1].thirdX, $scope.tempTriangles[numberOfTempTriangles - 1].thirdY);
                $scope.ctx.lineTo($scope.tempTriangles[numberOfTempTriangles - 1].startX, $scope.tempTriangles[numberOfTempTriangles - 1].startY);
                $scope.ctx.lineWidth = $scope.tempTriangles[numberOfTempTriangles - 1].thickness;
                $scope.ctx.strokeStyle = $scope.tempTriangles[numberOfTempTriangles - 1].color;
                $scope.ctx.stroke();
            }
            for (var i = 0; i < $scope.drawnTriangles.length; i++) {
                $scope.ctx.beginPath();
                $scope.ctx.moveTo($scope.drawnTriangles[i].startX, $scope.drawnTriangles[i].startY);
                $scope.ctx.lineTo($scope.drawnTriangles[i].endX, $scope.drawnTriangles[i].endY);
                $scope.ctx.lineTo($scope.drawnTriangles[i].thirdX, $scope.drawnTriangles[i].thirdY);
                $scope.ctx.lineTo($scope.drawnTriangles[i].startX, $scope.drawnTriangles[i].startY);
                $scope.ctx.lineWidth = $scope.drawnTriangles[i].thickness;
                $scope.ctx.strokeStyle = $scope.drawnTriangles[i].color;//"#4bf";
                $scope.ctx.stroke();
            }
        };
        // rectangles
        $scope.drawRectangleStrokes = function() {
            $scope.ctx.beginPath();
            var numberOfTempRectangles = $scope.tempRectangles.length;
            if(numberOfTempRectangles > 0) {
                $scope.ctx.rect($scope.tempRectangles[numberOfTempRectangles - 1].startX,
                    $scope.tempRectangles[numberOfTempRectangles - 1].startY,
                    $scope.tempRectangles[numberOfTempRectangles - 1].sizeX,
                    $scope.tempRectangles[numberOfTempRectangles - 1].sizeY);
                $scope.ctx.lineWidth = $scope.tempRectangles[numberOfTempRectangles - 1].thickness;
                $scope.ctx.strokeStyle = $scope.tempRectangles[numberOfTempRectangles - 1].color;
                $scope.ctx.stroke();
            }
            for (var i = 0; i < $scope.drawnRectangles.length; i++) {
                $scope.ctx.beginPath();
                $scope.ctx.rect($scope.drawnRectangles[i].startX, $scope.drawnRectangles[i].startY,
                    $scope.drawnRectangles[i].sizeX, $scope.drawnRectangles[i].sizeY);
                $scope.ctx.lineWidth = $scope.drawnRectangles[i].thickness;
                $scope.ctx.strokeStyle = $scope.drawnRectangles[i].color;
                $scope.ctx.stroke();
            }
        };

        $scope.showClearOptionsToolbox = function($event) {
            $scope.clearOption = '';
            $mdBottomSheet
                .show({
                    templateUrl: 'app/partials/clearOptionsGrid.html',
                    controller: 'clearOptionsGridController',
                    targetEvent: $event
                })
                .then(function(clickedItem) {
                    //$scope.clearOption = clickedItem;
                    if(clickedItem.name.toLowerCase() == "clear lines") {
                        $scope.clearLineDrawings();
                    } else if(clickedItem.name.toLowerCase() == "clear rectangles") {
                        $scope.clearRectangleDrawings();
                    } else if(clickedItem.name.toLowerCase() == "clear circles") {
                        $scope.clearCircleDrawings();
                    } else if(clickedItem.name.toLowerCase() == "clear triangles") {
                        $scope.clearTriangleDrawings();
                    } else if(clickedItem.name.toLowerCase() == "clear pen drawings") {
                        $scope.clearPenDrawings();
                    } else if(clickedItem.name.toLowerCase() == "clear all") {
                        $scope.clearDrawings();
                    }
                    //$scope.setTool($scope.cursorIcon);
                });
        };
    }])
/*
    .controller('clearOptionsController', function($scope, $mdBottomSheet, toolsService) {
        $scope.clearOption = '';
        $scope.showClearOptionsToolbox = function($event) {
            $scope.clearOption = '';
            $mdBottomSheet
                .show({
                    templateUrl: 'app/partials/clearOptionsGrid.html',
                    controller: 'clearOptionsGridController',
                    targetEvent: $event
                })
                .then(function(clickedItem) {
                    //$scope.clearOption = clickedItem;
                    if(clickedItem.name.toLowerCase() == "clear lines") {
                        $scope.clearLineDrawings();
                    } else if(clickedItem.name.toLowerCase() == "clear rectangles") {
                        $scope.clearRectangleDrawings();
                    } else if(clickedItem.name.toLowerCase() == "clear circles") {
                        $scope.clearCircleDrawings();
                    } else if(clickedItem.name.toLowerCase() == "clear triangles") {
                        $scope.clearTriangleDrawings();
                    } else if(clickedItem.name.toLowerCase() == "clear pen drawings") {
                        $scope.clearPenDrawings();
                    } else if(clickedItem.name.toLowerCase() == "clear all") {
                        $scope.clearDrawings();
                    }
                    //$scope.setTool($scope.cursorIcon);
                });
        };
    })
*/
    .controller('clearOptionsGridController', function($scope, $mdBottomSheet) {
        $scope.items = [
            { name: 'Clear All', icon: 'eraser' },
            { name: 'Clear Pen Drawings', icon: 'pen' },
            { name: 'Clear Lines', icon: 'line' },
            { name: 'Clear Circles', icon: 'circle' },
            { name: 'Clear Rectangles', icon: 'rectangle' },
            { name: 'Clear Triangles', icon: 'triangle' },
            { name: 'Clear Text', icon: 'text' }
        ];
        $scope.toolClicked = function($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
        };
    })

    .controller('toolboxController', function($scope, $mdBottomSheet, toolsService) {
        console.log("======== toolbox =============");
        $scope.cursorIcon = '';
        $scope.cursorColor = '';
        $scope.brushThickness = 1;
        $scope.setTool = function(tool, brushThickness, type) {
            if("item" == type) {
                toolsService.setTool(tool);
            } else if("color" == type) {
                toolsService.setColor(tool);
            }
            toolsService.setBrushThickness(brushThickness);
        };
        $scope.showToolbox = function($event) {
            $scope.cursorIcon = '';
            $scope.cursorColor = '';
            $mdBottomSheet
                .show({
                    templateUrl: 'app/partials/toolboxGrid.html',
                    controller: 'toolboxGridController',
                    targetEvent: $event
                })
                .then(function(value) {
                    $scope.brushThickness = value[1];
                    console.log("$scope.brushThickness ............... " + $scope.brushThickness);
                    if("item" == value[2]) {
                        var clickedItem = value[0];
                        $scope.cursorIcon = clickedItem;
                        $scope.setTool($scope.cursorIcon, $scope.brushThickness, "item");
                    } else if ("color" == value[2]){
                        var clickedColor = value[0];
                        $scope.cursorColor = clickedColor;
                        $scope.setTool($scope.cursorColor, $scope.brushThickness, "color");
                    } else {
                        $scope.setTool(value[0], $scope.brushThickness, value[2])
                    }
                });
        };
    })

    .controller('toolboxGridController', function($scope, $mdBottomSheet, toolsService) {
        $scope.brushThickness = 1;
        $scope.items = [
            { name: 'Pen', icon: 'pen' },
            { name: 'Circle', icon: 'circle' },
            { name: 'Line', icon: 'line' },
            { name: 'Rectangle', icon: 'rectangle' },
            { name: 'Triangle', icon: 'triangle' },
            { name: 'Text', icon: 'text' }
        ];
        $scope.colors = [
            { name: 'Black', color: 'black' },
            { name: 'Grey', color: 'grey' },
            { name: 'White', color: 'white' },
            { name: 'Red', color: 'red' },
            { name: 'Orange', color: 'orange' },
            { name: 'Yellow', color: 'yellow' },
            { name: 'Green', color: 'green' },
            { name: 'Blue', color: 'blue' },
            { name: 'Purple', color: 'purple' },
            { name: 'Brown', color: 'brown' }
        ];
        $scope.toolClicked = function($index) {
            $scope.brushThickness = document.getElementById('thicknessSlider').textContent;
            $scope.brushThickness = parseInt($scope.brushThickness);
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide([clickedItem, $scope.brushThickness, "item"]);
        };
        $scope.colorClicked = function($index) {
            $scope.brushThickness = document.getElementById('thicknessSlider').textContent;
            $scope.brushThickness = parseInt($scope.brushThickness);
            var clickedColor = $scope.colors[$index];
            $mdBottomSheet.hide([clickedColor, $scope.brushThickness, "color"]);
        };
        $scope.setThickness = function() {
            $scope.brushThickness = document.getElementById('thicknessSlider').textContent;
            $scope.brushThickness = parseInt($scope.brushThickness);
            $mdBottomSheet.hide([null, $scope.brushThickness, null]);
        };
    });