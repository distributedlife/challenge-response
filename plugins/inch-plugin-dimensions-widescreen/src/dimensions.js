"use strict";

module.exports = {
    deps: ['AspectRatio', 'WidescreenMinimumMargin', 'Window'],
    type: 'Dimensions',
    func: function (ratio, minMargin, window) {
        return {
            Dimensions: function () {
                var width;
                var height;
                var possibleHeight = Math.round(window().innerWidth / ratio());
                var possibleWidth = Math.round(window().innerHeight * ratio());
                var orientation;

                if (possibleHeight >= window().innerHeight) {
                    if (possibleWidth + minMargin() + minMargin() > window().innerWidth) {
                        width = window().innerWidth - minMargin() - minMargin();
                        height = possibleHeight;
                    } else {
                        width = possibleWidth;
                        height = window().innerHeight;
                    }

                    orientation = "landscape";
                } else {
                    if (possibleHeight + minMargin() + minMargin() > window().innerHeight) {
                        width = possibleWidth;
                        height = window().innerHeight - minMargin() - minMargin();
                    } else {
                        width = window().innerWidth;
                        height = possibleHeight;
                    }

                    orientation = "portrait";
                }

                return {
                    usableWidth: width,
                    usableHeight: height,
                    marginSides: Math.round(window().innerWidth - width) / 2,
                    marginTopBottom: Math.round(window().innerHeight - height) / 2,
                    orientation: orientation,
                    screenWidth: window().innerWidth,
                    screenHeight: window().innerHeight,
                    ratio: ratio()
                };
            }
        };
    }
};