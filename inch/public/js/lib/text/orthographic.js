var _ = require('lodash');
var TemporaryEffect = require('inch-temporary-effect');

var supports_transitions = require("../util/supports_transitions");
var apply_defaults = require("../ui/apply_defaults");
var base = require("../ui/base");
var inch_3js_mesh = require("../ui/threejs-mesh-helper")

"use strict";

module.exports = function(onCreate, onDestroy, settings) {
  var current = {};
  _.defaults(current, apply_defaults(settings));

  var positionCallback = function(mesh) {
    var position = current.position;
    position.x += (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x) * 0.1;

    return position;
  };

  var mesh = base.mesh.assemble(base.geometries.text, base.materials.basic, positionCallback, onCreate, current);

  var orthographic_text = {
    updateFromModel: function(updatedModel) {
      inch_3js_mesh.updateFromModel(updatedModel, current, mesh);
    },

    updateText: function(updatedText) {
      current.text = updatedText;

      onDestroy(mesh);

      mesh = base.mesh.assemble(base.geometries.text, base.materials.basic, positionCallback, onCreate, current);

      this.updateMesh(mesh);
    },

    onDeath: function() {
      this.fadeOut();
    }
  };

  _.extend(orthographic_text, supports_transitions(mesh, current));
  _.extend(orthographic_text, TemporaryEffect(
    current.duration, 
    orthographic_text.run,
    orthographic_text.onDeath.bind(orthographic_text)
  ));

  return orthographic_text;
};
