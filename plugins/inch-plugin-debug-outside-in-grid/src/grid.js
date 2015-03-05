"use strict";

module.exports = {
    deps: ["RenderEngineAdapter", "DebugProperties", "Dimensions"],
    type: "Debug",
    func: function (adapter, debugProperties, Dimensions) {
        var size = debugProperties.size || 50;
        var colour = debugProperties.colour || 0x00FF00;

        return {
            Debug: function () {
                var dims = Dimensions.Dimensions();
                var verticalLines = dims.usableWidth / size;
                var horizontalLines = dims.usableHeight / size;
                var x, y, w, h;

                var vertices = [];
                for (w = verticalLines / -2; w < 0; w += 1) {
                    x = w * size;

                    vertices.push({x: x, y: -dims.usableHeight, z: 0});
                    vertices.push({x: x, y:  dims.usableHeight, z: 0});
                }
                for (h = horizontalLines / -2; h < 0; h += 1) {
                    y = h * size;

                    vertices.push({x: -dims.usableWidth, y: y, z: 0});
                    vertices.push({x:  dims.usableWidth, y: y, z: 0});
                }
                for (w = verticalLines / 2; w >= 0; w -= 1) {
                    x = w * size;

                    vertices.push({x: x, y: -dims.usableHeight, z: 0});
                    vertices.push({x: x, y:  dims.usableHeight, z: 0});
                }
                for (h = horizontalLines / 2; h >= 0; h -= 1) {
                    y = h * size;

                    vertices.push({x: -dims.usableWidth, y: y, z: 0});
                    vertices.push({x:  dims.usableWidth, y: y, z: 0});
                }

                return adapter.createColouredLinePieces(vertices, colour);
            }
        };
    }
};