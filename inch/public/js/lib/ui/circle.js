"use strict";

module.exports = function(THREE) {
	var base = require("inch-geometry-base")(THREE);
	var _ = require('lodash');
	var temporaryEffect = require('inch-temporary-effect');
	var geometryTransitions = require("inch-geometry-transitions");
	var inch_3js_mesh = require("./threejs-mesh-helper")

	return function(on_create, on_destroy, settings) {
		var current = {};
		_.defaults(current, base.defaults(settings));
		
		var positionCallback = function(mesh) {
			var adjusted = current.position;
			adjusted.x += current.radius;

			return adjusted;
		};

		var mesh = base.mesh.assemble(base.geometries.circle, base.materials.basic, positionCallback, on_create, current);
		var transitions = geometryTransitions(mesh);

		var onDeath = function() {
			geometryTransitions.fadeOut();
		};

		var onTick = function(dt) {
			transitions.run(dt);
		}

		var circle = {
			updateFromModel: function(updated_model) {
		        inch_3js_mesh.updateFromModel(updated_model, current, mesh);
	      	}
		};		

		_.extend(circle, geometryTransitions(mesh, current));
		_.extend(circle, temporaryEffect(current.duration, onTick, onDeath));

		return circle;
	};
};