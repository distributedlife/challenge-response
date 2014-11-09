"use strict";

module.exports = function(THREE) {
    var _ = require('lodash');
    var temporaryEffect = require('inch-temporary-effect');
    var geometryTransitions = require("inch-geometry-transitions");
    var base = require("inch-geometry-base")(THREE);

    return function(onCreate, onDestroy, settings) {
        var current = {};
        _.defaults(current, base.defaults(settings));

        var positionCallback = function(mesh) {
            var position = current.position;
            position.x += (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x) * 0.1;

            return position;
        };

        var mesh = base.mesh.assemble(base.geometries.text, base.materials.basic, positionCallback, onCreate, current);

        var orthographic_text = {
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

        _.extend(orthographic_text, geometryTransitions(mesh, current));
        _.extend(orthographic_text, temporaryEffect(
            current.duration, 
            orthographic_text.run,
            orthographic_text.onDeath.bind(orthographic_text)
        ));

        return orthographic_text;
    };
};