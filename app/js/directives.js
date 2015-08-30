/**
 * Created by Nishant on 8/28/2015.
 */
angular.module('mainApp')
    .directive("drawing", function(){
        return {
            restrict: "A",
            link: function(scope, element, attributes){
                console.log("===== canvas directive ======");
                console.log(element);
                console.log(attributes.toolstyle);
                var drawingStyle = attributes.toolstyle;
                var ctx = element[0].getContext('2d');

                // variable that decides if something should be drawn on mousemove
                var drawing = false;

                // the last coordinates before the current move
                var lastX;
                var lastY;

                var drawnLines = [];
                var drawnRectangles = [];

                element.bind('mousedown', function(event){
                    console.log("mouse down ============= ");
                    console.log(attributes.toolstyle);
                    if(event.offsetX!==undefined){
                        lastX = event.offsetX;
                        lastY = event.offsetY;
                    } else {
                        lastX = event.layerX - event.currentTarget.offsetLeft;
                        lastY = event.layerY - event.currentTarget.offsetTop;
                    }

                    // begins new line
                    ctx.beginPath();
                    drawing = true;
                });
                element.bind('mousemove', function(event){
                    if(drawing){
                        var currentX = 0;
                        var currentY = 0;
                        // get current mouse position
                        if(event.offsetX!==undefined){
                            currentX = event.offsetX;
                            currentY = event.offsetY;
                        } else {
                            currentX = event.layerX - event.currentTarget.offsetLeft;
                            currentY = event.layerY - event.currentTarget.offsetTop;
                        }

                        draw(lastX, lastY, currentX, currentY);

                        /*
                        if(attributes.toolstyle == "pen")
                        {
                            // set current coordinates to last one
                            lastX = currentX;
                            lastY = currentY;
                        }
                        */
                    }

                });
                element.bind('mouseup', function(event){
                    // stop drawing
                    drawing = false;
                    var currentX = 0;
                    var currentY = 0;
                    if(event.offsetX!==undefined){
                        currentX = event.offsetX;
                        currentY = event.offsetY;
                    } else {
                        currentX = event.layerX - event.currentTarget.offsetLeft;
                        currentY = event.layerY - event.currentTarget.offsetTop;
                    }

                    if(attributes.toolstyle == "line") {
                        var drawnLine = {
                            startX: lastX,
                            startY: lastY,
                            endX: currentX,
                            endY: currentY
                        };
                        drawnLines.push(drawnLine);
                    } else if(attributes.toolstyle == "rectangle") {
                        var drawnRectangle = {
                            startX: lastX,
                            startY: lastY,
                            sizeX: currentX - lastX,
                            sizeY: currentY - lastY
                        };
                        drawnRectangles.push(drawnRectangle);
                    }
                });

                // canvas reset
                function reset(){
                    element[0].width = element[0].width;
                }

                function draw(startX, startY, currentX, currentY){
                    if(attributes.toolstyle == "pen") {
                        // line from
                        //ctx.moveTo(startX,startY);
                        // to
                        ctx.lineTo(currentX,currentY);
                        // color
                        ctx.strokeStyle = "#4bf";
                        // draw it
                        ctx.stroke();
                    } else if(attributes.toolstyle == "rectangle") {
                        reset();
                        for(var i = 0; i < drawnLines.length; i++) {
                            ctx.moveTo(drawnLines[i].startX, drawnLines[i].startY);
                            ctx.lineTo(drawnLines[i].endX, drawnLines[i].endY);
                        }
                        for(var i = 0; i < drawnRectangles.length; i++) {
                            ctx.rect(drawnRectangles[i].startX, drawnRectangles[i].startY,
                                drawnRectangles[i].sizeX, drawnRectangles[i].sizeY);
                        }
                        var sizeX = currentX - startX;
                        var sizeY = currentY - startY;

                        ctx.rect(startX, startY, sizeX, sizeY);
                        ctx.lineWidth = 3;
                        // color
                        ctx.strokeStyle = '#4bf';
                        // draw it
                        ctx.stroke();
                    } else if(attributes.toolstyle == "line") {
                        reset();
                        for(var i = 0; i < drawnLines.length; i++) {
                            ctx.moveTo(drawnLines[i].startX, drawnLines[i].startY);
                            ctx.lineTo(drawnLines[i].endX, drawnLines[i].endY);
                        }
                        for(var i = 0; i < drawnRectangles.length; i++) {
                            ctx.rect(drawnRectangles[i].startX, drawnRectangles[i].startY,
                                drawnRectangles[i].sizeX, drawnRectangles[i].sizeY);
                        }
                        //ctx.beginPath();
                        ctx.moveTo(startX,startY);
                        ctx.lineTo(currentX, currentY);
                        ctx.lineWidth = 3;
                        // color
                        ctx.strokeStyle = '#4bf';
                        // draw it
                        ctx.stroke();
                    }
                }
            }
        };
    })
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