"use strict";

var _ = require('lodash');
var TemporaryEffect = require('inch-temporary-effect');
var transitions_3js = require("../util/supports_transitions");
var apply_defaults = require("../ui/apply_defaults");
var base_3js = require("../ui/base");
var inch_3js_mesh = require("./threejs-mesh-helper")

module.exports = function(on_create, on_destroy, settings) {
	var current = {};
	_.defaults(current, apply_defaults(settings));
	
	var positionCallback = function(mesh) {
		var adjusted = current.position;
		adjusted.x += current.radius;

		return adjusted;
	};

	var mesh = base_3js.mesh.assemble(base_3js.geometries.circle, base_3js.materials.basic, positionCallback, on_create, current);
	var transitions = transitions_3js(mesh);

	var onDeath = function() {
		transitions_3js.fadeOut();
	};

	var onTick = function(dt) {
		transitions.run(dt);
	}

	var circle = {
		updateFromModel: function(updated_model) {
	        inch_3js_mesh.updateFromModel(updated_model, current, mesh);
      	}
	};		

	_.extend(circle, transitions_3js(mesh, current));
	_.extend(circle, TemporaryEffect(current.duration, onTick, onDeath));

	return circle;
};