var _ = require('lodash');
var a_temporary_effect = require("../util/temporary_effect");
var supports_transitions = require("../util/supports_transitions");
var apply_defaults = require("../ui/apply_defaults");
var base = require("../ui/base");
var alignment = require("../math/alignment");

"use strict";

module.exports = function(on_create, on_destroy, settings) {
	var current = {};
	_.defaults(current, apply_defaults(settings));
	
	var position_callback = function(mesh) {
		var adjusted = current.position;
		adjusted.x += settings.radius;

		return adjusted;
	};

	var mesh = base.mesh.assemble(base.geometries.circle, base.materials.basic, position_callback, on_create, current);

	var circle = {
		update_from_model: function(updated_model) {
	        current.position = {x: updated_model.x, y: updated_model.y, z: updated_model.z};
	        mesh.position = alignment.align_to_self(current.position, base.mesh.width(mesh), base.mesh.height(mesh), current.alignment);
	        mesh.visible = updated_model.active || true;
      	},
      	on_tick: function(dt) {
		    if (!this.is_alive()) {
				mesh.visible = false;
		    }

		    this.run_transitions(dt);
	  	}
	};		

	_.extend(circle, supports_transitions(mesh, current));
	_.extend(circle, a_temporary_effect(current.duration, circle.on_tick.bind(circle)));

	return circle;
};