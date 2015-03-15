"use strict";

module.exports = function (adapter) {
    var base = require("../../inch-geometry-base/src/geometry.js")(adapter);
    var _ = require('lodash');
    var temporaryEffect = require('../../../plugins/inch-temporary-effect/src/temporary_effect.js');
    var geometryTransitions = require("../../inch-geometry-transitions/src/transitions.js");

    return function (onCreate, onDestroy, settings) {
        var current = {};
        _.defaults(current, base.defaults(settings));

        var positionCallback = function () {
            var adjusted = current.position;
            adjusted.x += current.radius;
            adjusted.y -= current.radius / 2;

            return adjusted;
        };

        var mesh = base.mesh.assemble(base.geometries.circle, base.materials.basic, positionCallback, onCreate, current);
        var transitions = geometryTransitions(mesh);

        var onDeath = function () {
            geometryTransitions.fadeOut();
            onDestroy();
        };

        var onTick = function (dt) {
            transitions.run(dt);
        };

        var circle = {};
        _.extend(circle, geometryTransitions(mesh, current));
        _.extend(circle, temporaryEffect(current.duration, onTick, onDeath));

        return circle;
    };
};