"use strict"

var alignment = require("../math/alignment");

module.exports = {
	updateFromModel: function (updated_model, config, mesh) {
		config.position = {x: updated_model.x, y: updated_model.y, z: updated_model.z || 0};
	    mesh.position = alignment.align_to_self(config.position, base.mesh.width(mesh), base.mesh.height(mesh), config.alignment);
	    mesh.visible = updated_model.active || true;
	}
}