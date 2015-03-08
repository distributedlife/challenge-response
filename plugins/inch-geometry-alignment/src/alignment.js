"use strict";

var _ = require('lodash');

var repositionX = function (alignment, currentPosition, areaWidth) {
  if (alignment === "left") {
    return currentPosition.x;
  } else if (alignment === "right") {
    return currentPosition.x - areaWidth;
  } else {
    return currentPosition.x - (areaWidth / 2);
  }
};

var repositionY = function (alignment, currentPosition, areaHeight) {
  if (alignment === "top") {
    return currentPosition.y + areaHeight;
  } else if (alignment === "bottom") {
    return currentPosition.y;
  } else {
    return currentPosition.y + (areaHeight / 4);
  }
};

module.exports = {
  toSelf2d: function (position, areaWidth, areaHeight, options) {
    _.defaults(options, {
      horizontal: "centre",
      vertical: "centre"
    });

    var newPosition = {x: 0, y: 0, z: 0};
    var currentPosition = {
      x: typeof position.x === 'function' ? position.x() : position.x,
      y: typeof position.y === 'function' ? position.y() : position.y,
      z: typeof position.z === 'function' ? position.z() : position.z
    };

    newPosition.x = repositionX(options.horizontal, currentPosition, areaWidth);
    newPosition.y = repositionY(options.vertical, currentPosition, areaHeight);
    newPosition.z = currentPosition.z;

    return newPosition;
  }
};