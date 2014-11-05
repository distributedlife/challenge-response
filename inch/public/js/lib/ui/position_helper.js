"use strict";

module.exports = function(sw, sh, lw, lh) {
    var current_screen_width = sw;
    var current_screen_height = sh;
    var current_level_width = lw;
    var current_level_height = lh;

    var screen_width = function() { return current_screen_width; };
    var screen_height = function() { return current_screen_height; };
    var game_width = function() { 
    	return (current_level_width / current_screen_width) * current_level_width;
    	// return current_screen_width * current_screen_width / current_level_width; 
    };
    var game_height = function() { 
    	return (current_level_height / current_screen_height) * current_level_height; 
    	// return current_screen_height * current_screen_height / current_level_height; 
    };

    var div = function(dim, slices) {
        return function(p) {
            return dim * (p / slices);
        }
    };

    var build_coordinate_helpers = function(width, height) {
        return {
            left: function() {
                return div(width(), 2)(0);
            },
            centre_x: function() {
                return div(width(), 2)(1);
            },
            right: function() {
                return div(width(), 2)(2);
            },
            gridNx: function(n, p) {
                return div(width(), n)(p);
            },
            top: function() {
                return div(height(), 2)(0);
            },
            centre_y: function() {
                return div(height(), 2)(1);
            },
            bottom: function() {
                return div(height(), 2)(2);
            },
            gridNy: function(n, p) {
                return div(height(), n)(p);
            }
        }
    };

    return {
        ss: build_coordinate_helpers(screen_width, screen_height),
        gs: build_coordinate_helpers(game_width, game_height),

        update_screen_dims: function(sw, sh) {
    		current_screen_width = sw;
    		current_screen_height = sh;
    	},
    	update_level_dims: function(lh, lw) {
        	current_level_width = lw;
        	current_level_height = lh;
        }
    };
    };