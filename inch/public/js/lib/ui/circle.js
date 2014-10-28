define(["vendor/three", "lib/util/temporary_effect", "lib/math/alignment", "lib/util/supports_transitions", "lib/ui/apply_defaults"], function(THREE, a_temporary_effect, alignment, supports_transitions, apply_defaults) {
	"use strict";

	return function(on_create, on_destroy, settings) {
		var current = {};
    	_.defaults(current, apply_defaults(settings));

		var assemble_mesh = function() {
			var material = new THREE.MeshBasicMaterial({
		        transparent: current.transparent,
		        alphaTest: current.alphaTest,
		        blending: current.blending,
		        opacity: current.colour.current[3]
			});
			material.color.setRGB(current.colour.current[0], current.colour.current[1], current.colour.current[2]);  

			var geometry = new THREE.CircleGeometry(current.radius, current.segments);	

			//TODO: this bit of code is pretty common			
			var new_mesh = new THREE.Mesh(geometry, material);
			new_mesh.position = alignment.align_to_self(current.position, new_mesh.geometry.boundingSphere.radius * -0.01, new_mesh.geometry.boundingSphere.radius * -0.05, current.alignment);
      		new_mesh.rotation.x = -90; 
      		new_mesh.scale.set(current.scale.current, current.scale.current, current.scale.current);
			
			on_create(new_mesh);
			return new_mesh
		} 

		var mesh = assemble_mesh();

		var circle = {
			//TODO: width, height, and update_from_model could be mixed in; on_tick too
			//TODO: update these to use boundingBox over sphere if exist
			width: function() { return mesh.geometry.boundingSphere.radius * 2; },
      		height: function() { return mesh.geometry.boundingSphere.radius * 2; },

      		update_from_model: function(updated_model) {
		        current.position = {x: updated_model.x, y: updated_model.y, z: 0};
		        mesh.position = alignment.align_to_self(current.position, this.width(), this.height(), current.alignment);
		        mesh.visible = updated_model.active || true;
	      	},

	      	//The basic empty function should be added by 'standard_ui_behaviour'
	      	on_tick: function(dt) {
	      		//this behaviour should be added by 'a_temporary_effect'
			    if (!this.is_alive()) {
					mesh.visible = false;
			    }

			    //this behaviour should be added by supports transitions
			    this.run_transitions(dt);
		  	}
		};

		// var on_tick = function() {};
		// var wrap_func = function(old_func, new_func) {
		// 	return function(dt) {
		// 		prior(dt);
		// 		new_func(dt);
		// 	};
		// }
		// circle.on_tick = wrap_func(circle.on_tick, function(dt) {
		// 	if (!this.is_alive()) {
		// 		mesh.visible = false;
		// 	}
		// });

		// circle.on_tick = wrap_func(circle.on_tick, function(dt) {
		// 	this.run_transitions(dt);
		// });

		// _.extend(circle, standard_ui_behaviour());
		_.extend(circle, supports_transitions(mesh, current));
    	_.extend(circle, a_temporary_effect(current.duration, circle.on_tick.bind(circle)));

		return circle;
	};
});