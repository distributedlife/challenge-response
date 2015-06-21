'use strict';

var _ = require('lodash');
var temporaryEffect = require('../../supporting-libs/temporary_effect.js');
var lerp = require('lerp');

module.exports = function (mesh, current) {
    var transitions = [];

    var createTickColourFunction = function (from, to) {
        return function (dt, progress) {
            current.colour = [
                lerp(from[0], to[0], progress),
                lerp(from[1], to[1], progress),
                lerp(from[2], to[2], progress)
            ];

            mesh.material.color.setRGB(current.colour[0], current.colour[1], current.colour[2]);
            mesh.material.needsUpdate = true;
        };
    };

    var createTickScaleFunction = function (from, to) {
        return function (dt, progress) {
            current.scale = lerp(from, to, progress);

            mesh.scale.set(current.scale, current.scale, current.scale);
        };
    };

    var createTickAlphaFunction = function (finalOpacity) {
        var initialOpacity = mesh.material.opacity;

        return function (dt, progress) {
            current.opacity = lerp(initialOpacity, finalOpacity, progress);
            mesh.transparent = true;
            mesh.material.opacity = current.opacity;
            mesh.material.needsUpdate = true;
        };
    };

    var addTemporaryEffect = function (duration, callback) {
        if (duration === 0 || duration === undefined) {
            callback(undefined, 1.0);
        } else {
            transitions.push(Object.create(temporaryEffect(duration, callback)));
        }
    };

    return {
        updateMesh: function (newMesh) {
            mesh = newMesh;
        },
        changeColour: function (duration, to) {
            var currentColor = mesh.material.color;
            addTemporaryEffect(duration, createTickColourFunction([currentColor.r, currentColor.g, currentColor.b], to));
        },
        transitionColour: function (duration, from, to) {
            addTemporaryEffect(duration, createTickColourFunction(from, to));
        },
        fadeIn: function (duration, finalOpacity) {
            finalOpacity = finalOpacity || 1.0;
            addTemporaryEffect(duration, createTickAlphaFunction(finalOpacity));
        },
        fadeOut: function (duration) {
            addTemporaryEffect(duration, createTickAlphaFunction(0.0));
        },
        scale: function (duration, from, to) {
            addTemporaryEffect(duration, createTickScaleFunction(from, to));
        },
        run: function (dt) {
            _.each(transitions, function (t) {
                t.tick(dt);
            });

            transitions = _.reject(transitions, function (t) {
                return !t.isAlive();
            });
        }
    };
};