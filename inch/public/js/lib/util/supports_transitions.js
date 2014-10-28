define(["lib/util/temporary_effect", "lib/math/lerp"], function(a_temporary_effect, lerp) {
	"use strict";

	return function(mesh, settings) {
		var transitions = [];
	    var current_mesh = mesh;

		var tick_colour = function(dt, progress) {
	        settings.colour.current = lerp.lerpRGBA(settings.colour.from, settings.colour.to, progress);
	        
	        current_mesh.material.color.setRGB(settings.colour.current[0], settings.colour.current[1], settings.colour.current[2]);  
	        current_mesh.material.opacity = settings.colour.current[3];
	        current_mesh.material.needsUpdate = true;
	    };

	    var add_temporary_effect = function(duration, callback) {
	    	if (duration === 0) {
				callback(undefined, 1.0);
			} else {
				transitions.push(Object.create(a_temporary_effect(duration, callback)));
			}
	    };

		return {
			update_mesh: function(new_mesh) {
				current_mesh = new_mesh;
			},
			fade_in: function(duration, final_opacity) {
				duration = duration || 0;
				final_opacity = final_opacity || 1.0;

				settings.colour.to[3] = final_opacity;
				add_temporary_effect(duration, tick_colour);
			},
		    fade_out: function(duration) {
		    	duration = duration || 0;
		    	
		        settings.colour.to[3] = 0.0;
		        add_temporary_effect(duration, tick_colour);
		    },
		    run_transitions: function(dt) {
		    	_.each(transitions, function(t) { t.tick(dt); });
        		transitions = _.reject(transitions, function(t) { !t.is_alive(); });
		    }
		};
	};
});