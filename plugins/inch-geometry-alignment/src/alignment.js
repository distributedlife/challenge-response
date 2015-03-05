"use strict";

var _ = require('lodash');

module.exports = {
    toSelf2d: function (position, width, height, options) {
        _.defaults(options, {
            horizontal: "centre",
            vertical: "centre"
        });

        var newPosition = {x: 0, y: 0, z: 0};
        var resolvePositionValues = {
            x: typeof position.x === 'function' ? position.x() : position.x,
            y: typeof position.y === 'function' ? position.y() : position.y,
            z: typeof position.z === 'function' ? position.z() : position.z
        };

        if (options.horizontal === "left") {
            newPosition.x = resolvePositionValues.x;
        } else if (options.horizontal === "right") {
            newPosition.x = resolvePositionValues.x - width;
        } else {
            newPosition.x = resolvePositionValues.x - (width / 2);
        }

        if (options.vertical === "top") {
            newPosition.y = resolvePositionValues.y + height;
        } else if (options.vertical === "bottom") {
            newPosition.y = resolvePositionValues.y;
        } else {
            newPosition.y = resolvePositionValues.y + (height / 4);
        }

        newPosition.z = resolvePositionValues.z;

        return newPosition;
    }
};