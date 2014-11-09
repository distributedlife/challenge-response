var _ = require('lodash');
var TemporaryEffect = require('inch-temporary-effect');
var lerp = require('lerp');

"use strict";

module.exports = function(mesh) {
	var transitions = [];

    createTickColourFunction = function(from, to) {
    	return function(dt, progress) {
    		var current = [
    			lerp(from[0], to[0], progress),
    			lerp(from[1], to[1], progress),
    			lerp(from[2], to[2], progress)
    		];
        
        	mesh.material.color.setRGB(current[0], current[1], current[2]);
        	mesh.material.needsUpdate = true;
        };
    };

    createTickScaleFunction = function(from, to) {
    	return function(dt, progress) {
    		var current = lerp(from, to, progress);

    		mesh.scale.set(current, current, current);
    	};
    };

    var createTickAlphaFunction = function(finalOpacity) {
    	var initialOpacity = mesh.material.opacity;

    	return function(dt, progress) {
	        mesh.transparent = true;
	        mesh.material.opacity = lerp(initialOpacity, finalOpacity, progress);
	        mesh.material.needsUpdate = true;
    	};
    };

    var addTemporaryEffect = function(duration, callback) {
    	if (duration === 0 || duration === undefined) {
			callback(undefined, 1.0);
		} else {
			transitions.push(Object.create(TemporaryEffect(duration, callback)));
		}
    };

	return {
		updateMesh: function(newMesh) {
			mesh = newMesh;
		},
		changeColour: function(duration, to) {
			var currentColor = mesh.material.color;
			addTemporaryEffect(duration, createTickColourFunction([currentColor.r, currentColor.g, currentColor.b], to));
		},
		transitionColour: function(duration, from, to) {
			addTemporaryEffect(duration, createTickColourFunction(from, to));
		},
		fadeIn: function(duration, finalOpacity) {
			addTemporaryEffect(duration, createTickAlphaFunction(finalOpacity || 1.0));
		},
	    fadeOut: function(duration) {
        	addTemporaryEffect(duration, createTickAlphaFunction(0.0));
	    },
	    scale: function(duration, from, to) {
	    	addTemporaryEffect(duration, createTickScaleFunction(from, to));
	    },
	    run: function(dt) {
	    	_.each(transitions, function(t) { t.tick(dt); });
    		transitions = _.reject(transitions, function(t) { !t.isAlive(); });
	    }
	};
};