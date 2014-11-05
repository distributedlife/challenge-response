var _ = require('lodash');
var a_temporary_effect = require("../util/temporary_effect");
var alignment = require("../math/alignment");
var supports_transitions = require("../util/supports_transitions");
var apply_defaults = require("../ui/apply_defaults");
var base = require("../ui/base");

"use strict";

module.exports = function(on_create, on_destroy, settings) {
  var current = {};
  _.defaults(current, apply_defaults(settings));

  var position_callback = function(mesh) {
    var position = current.position;
    position.x += (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x) * 0.1;

    return position;
  };

  var mesh = base.mesh.assemble(base.geometries.text, base.materials.basic, position_callback, on_create, current);

  var orthographic_text = {
    update_from_model: function(updated_model) {
      current.position = {x: updated_model.x, y: updated_model.y, z: 0};
      mesh.position = alignment.align_to_self(current.position, base.mesh.width(mesh), base.mesh.height(mesh), current.alignment);
      mesh.visible = updated_model.active || true;
    },

    update_text: function(updatedText) {
      current.visible = mesh.visible;
      current.text = updatedText;

      on_destroy(mesh);

      mesh = base.mesh.assemble(base.geometries.text, base.materials.basic, position_callback, on_create, current);
      mesh.position = alignment.align_to_self(current.position, base.mesh.width(mesh), base.mesh.height(mesh), current.alignment);
      mesh.visible = current.visible;

      this.update_mesh(mesh);
    },

    on_tick: function(dt) {
      if (!this.is_alive()) {
        mesh.visible = false;
      }

      this.run_transitions(dt);
    }
  };

  _.extend(orthographic_text, supports_transitions(mesh, current));
  _.extend(orthographic_text, a_temporary_effect(current.duration, orthographic_text.on_tick.bind(orthographic_text)));

  return orthographic_text;
};
