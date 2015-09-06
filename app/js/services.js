/**
 * Created by Nishant on 8/28/2015.
 */
angular.module('mainApp')
    .service('toolsService', function() {
        var toolSelected = null;
        var colorSelected = null;
        var setTool = function(newTool) {
            toolSelected = newTool;
        };
        var getTool = function() {
            return toolSelected;
        };
        var setColor = function(selectedColor) {
            colorSelected = selectedColor;
        };
        var getColor = function() {
            return colorSelected;
        }
        return {
            setTool: setTool,
            getTool: getTool,
            setColor: setColor,
            getColor: getColor
        };
    });