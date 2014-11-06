var THREE = require('inch-threejs');
var _ =  require('lodash');

"use strict";

module.exports = function(options) {
    options = options || {}

    var defaults = {
        transparent: false,
        alphaTest: 0.1,
        blending: THREE.AdditiveBlending,
        size: 20,
        duration: 0,
        alignment: {
            horizontal: "centre",
            vertical: "centre"
        },
        scale: {
            from: 1.0,
            to: 1.0
        },
        colour: {
            from: [1.0, 1.0, 1.0],
            to: [1.0, 1.0, 1.0]
        },
        opacity: {
            from: 1.0,
            to: 1.0
        },
        position: {x: 0, y: 0, z: 0},
        start_hidden: false
    }

    _.defaults(options, _.clone(defaults));

    if (options.start_hidden) {
        options.transparent = true;
        options.opacity.from = 0.0;
        options.opacity.to = 0.0;
    }

    options.colour.current = options.colour.from;
    options.scale.current = options.scale.from;
    options.opacity.current = options.opacity.from;
    options.size *= 10.0;

    return options;
};