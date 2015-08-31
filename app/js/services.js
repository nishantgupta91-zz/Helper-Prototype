/**
 * Created by Nishant on 8/28/2015.
 */
angular.module('mainApp')
    .service('toolsService', function() {
        var toolSelected = null;
        var setTool = function(newTool) {
            toolSelected = newTool;
        };
        var getTool = function() {
            return toolSelected;
        };
        return {
            setTool: setTool,
            getTool: getTool
        };
    });