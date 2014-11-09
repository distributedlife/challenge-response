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
        scale: 1.0,
        colour: [1.0, 1.0, 1.0],
        opacity: 1.0,
        position: {x: 0, y: 0, z: 0},
        start_hidden: false
    }

    _.defaults(options, _.clone(defaults));

    if (options.start_hidden) {
        options.transparent = true;
        options.opacity = 0.0;
    }

    options.size *= 10.0;

    return options;
};