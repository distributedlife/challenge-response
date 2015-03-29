"use strict";

module.exports = {
    deps: ["Dimensions"],
    type: "PositionHelper",
    func: function (dimensions) {
        return {
            centreInCamera: function (camera, width, height) {
                //http://zachberry.com/blog/tracking-3d-objects-in-2d-with-three-js/
                var dims = dimensions().Dimensions();
                var visibleWidth, visibleHeight, percX, percY;

                visibleWidth = camera.right - camera.left;
                visibleHeight = camera.top - camera.bottom;

                percX = (-camera.left / visibleWidth) * dims.usableWidth;
                percY = (1 - (-camera.bottom / visibleHeight)) * dims.usableHeight;

                return {
                    left: percX - (width / 2) + dims.marginSides,
                    top: percY - (height / 2) + dims.marginTopBottom
                };
            }
        };
    }
};