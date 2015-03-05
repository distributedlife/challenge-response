"use strict";

var _ =  require('lodash');

module.exports = function (adapter) {
    return function (options) {
        options = options || {};

        var defaults = {
            transparent: false,
            alphaTest: 0.1,
            blending: adapter.getAdditiveBlendingConstant(),
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
            startHidden: false
        };

        _.defaults(options, _.clone(defaults));

        if (options.startHidden) {
            options.transparent = true;
            options.opacity = 0.0;
        }

        options.size *= 10.0;

        return options;
    };
};