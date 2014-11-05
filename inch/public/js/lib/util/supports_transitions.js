var _ = require('lodash');
var a_temporary_effect = require('../util/temporary_effect');
var lerp = require('../math/lerp');

"use strict";

module.exports = function(mesh, settings) {
	var transitions = [];
    var current_mesh = mesh;

	var tick_colour = function(dt, progress) {
        settings.colour.current = lerp.lerpRGBA(settings.colour.from, settings.colour.to, progress);
        
        current_mesh.material.color.setRGB(settings.colour.current[0], settings.colour.current[1], settings.colour.current[2]);  
        current_mesh.material.opacity = settings.colour.current[3];
        current_mesh.material.needsUpdate = true;
    };

    var tick_scale = function(dt, progress) {
    	settings.scale.current = lerp.lerp(settings.scale.from, settings.scale.to, progress);

    	current_mesh.scale.set(settings.scale.current, settings.scale.current, settings.scale.current);
    };

    var add_temporary_effect = function(duration, callback) {
    	if (duration === 0 || duration === undefined) {
			callback(undefined, 1.0);
		} else {
			transitions.push(Object.create(a_temporary_effect(duration, callback)));
		}
    };

	return {
		update_mesh: function(new_mesh) {
			current_mesh = new_mesh;
		},
		change_colour: function(duration, rgba) {
			settings.colour.to = rgba;

			add_temporary_effect(duration, tick_colour);
		},
		transition_colour: function(duration, from, to) {
			settings.colour.from = from;
			settings.colour.to = to;

			add_temporary_effect(duration, tick_colour);
		},
		fade_in: function(duration, final_opacity) {
			final_opacity = final_opacity || 1.0;
			settings.colour.to[3] = final_opacity;

			add_temporary_effect(duration, tick_colour);
		},
	    fade_out: function(duration) {
	        settings.colour.to[3] = 0.0;

        	add_temporary_effect(duration, tick_colour);
	    },
	    scale: function(duration, from, to) {
	    	settings.scale.from = from;
	    	settings.scale.to = to;

	    	add_temporary_effect(duration, tick_scale);
	    },
	    run_transitions: function(dt) {
	    	_.each(transitions, function(t) { t.tick(dt); });
    		transitions = _.reject(transitions, function(t) { !t.is_alive(); });
	    }
	};
};