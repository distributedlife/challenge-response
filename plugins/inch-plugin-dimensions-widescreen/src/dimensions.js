'use strict';

module.exports = {
  deps: ['AspectRatio', 'WidescreenMinimumMargin', 'Window'],
  type: 'Dimensions',
  func: function (ratio, minMargin, window) {
    return {
      get: function () {
        var actualWidth = window().innerWidth;
        var actualHeight = window().innerHeight;
        var heightBasedOnWidth = Math.round(actualWidth / ratio());
        var widthBasedOnHeight = Math.round(actualHeight * ratio());
        var totalMargin = minMargin() + minMargin();

        var usableWidth;
        var usableHeight;
        var orientation;

        if (heightBasedOnWidth >= actualHeight) {
          if (widthBasedOnHeight + totalMargin > actualWidth) {
            usableWidth = actualWidth - totalMargin;
            usableHeight = heightBasedOnWidth;
          } else {
            usableWidth = widthBasedOnHeight;
            usableHeight = actualHeight;
          }

          orientation = 'landscape';
        } else {
          if (heightBasedOnWidth + totalMargin > actualHeight) {
            usableWidth = widthBasedOnHeight;
            usableHeight = actualHeight - totalMargin;
          } else {
            usableWidth = actualWidth;
            usableHeight = heightBasedOnWidth;
          }

          orientation = 'portrait';
        }

        return {
          usableWidth: usableWidth,
          usableHeight: usableHeight,
          marginSides: Math.round(actualWidth - usableWidth) / 2,
          marginTopBottom: Math.round(actualHeight - usableHeight) / 2,
          orientation: orientation,
          screenWidth: actualWidth,
          screenHeight: actualHeight,
          ratio: ratio()
        };
      }
    };
  }
};