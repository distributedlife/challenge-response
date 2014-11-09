"use strict"

var alignment = require("inch-geometry-alignment");

module.exports = {
	updateFromModel: function (updated_model, config, mesh) {
		config.position = {x: updated_model.x, y: updated_model.y, z: updated_model.z || 0};
	    mesh.position = alignment.toSelf2d(config.position, base.mesh.width(mesh), base.mesh.height(mesh), config.alignment);
	    mesh.visible = updated_model.active || true;
	}
}