var _ = require('lodash');
var temporaryEffect = require('inch-temporary-effect');
var geometryTransitions = require("inch-geometry-transitions");

var base_3js = require("../ui/base");
var inch_3js_mesh = require("../ui/threejs-mesh-helper")

"use strict";

module.exports = function(onCreate, onDestroy, settings) {
  var current = {};
  _.defaults(current, base_3js.defaults(settings));

  var positionCallback = function(mesh) {
    var position = current.position;
    position.x += (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x) * 0.1;

    return position;
  };

  var mesh = base_3js.mesh.assemble(base_3js.geometries.text, base_3js.materials.basic, positionCallback, onCreate, current);

  var orthographic_text = {
    updateFromModel: function(updatedModel) {
      inch_3js_mesh.updateFromModel(updatedModel, current, mesh);
    },

    updateText: function(updatedText) {
      current.text = updatedText;

      onDestroy(mesh);

      mesh = base_3js.mesh.assemble(base_3js.geometries.text, base_3js.materials.basic, positionCallback, onCreate, current);

      this.updateMesh(mesh);
    },

    onDeath: function() {
      this.fadeOut();
    }
  };

  _.extend(orthographic_text, geometryTransitions(mesh, current));
  _.extend(orthographic_text, temporaryEffect(
    current.duration, 
    orthographic_text.run,
    orthographic_text.onDeath.bind(orthographic_text)
  ));

  return orthographic_text;
};
