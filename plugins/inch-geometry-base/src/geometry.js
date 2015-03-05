"use strict";

var alignment = require("../../inch-geometry-alignment/src/alignment.js");

module.exports = function (adapter) {
    var width = function (mesh) {
        if (mesh.geometry.boundingBox) {
            return mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x;
        }

        return mesh.geometry.boundingSphere.radius * 2;
    };

    var height = function (mesh) {
        if (mesh.geometry.boundingBox) {
            return mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y;
        }

        return mesh.geometry.boundingSphere.radius * 2;
    };

    var materials = {
        basic: function (options) {
            var material = adapter.newBasicMaterial();
            adapter.setTransparent(material, options.transparent);
            adapter.setAlphaTest(material, options.alphaTest);
            adapter.setBlending(material, options.blending);
            adapter.setOpacity(material, options.opacity);
            adapter.setColour(material, options.colour);

            return material;
        }
    };

    var geometries = {
        circle: function (options) {
            return adapter.newCircle(options.radius, options.segments);
        },
        text: function (options) {
            var shape = adapter.newShapeFromText(options.text, options);
            var geometry = adapter.newGeometryFromShape(shape);
            adapter.computeBoundingBox(geometry);

            return geometry;
        }
    };

    var mesh = {
        width: width,
        height: height,
        assemble: function (geometryCallback, materialCallback, positionCallback, onCreate, options) {
            var newMesh = adapter.newMesh(geometryCallback(options), materialCallback(options));

            var newPosition = alignment.toSelf2d(positionCallback(newMesh), width(newMesh), height(newMesh), options.alignment);
            adapter.setPosition(newMesh, newPosition);
            adapter.setScale(newMesh, options.scale);
            adapter.setVisible(newMesh, true);

            onCreate(newMesh);

            return newMesh;
        }
    };

    return {
        materials: materials,
        geometries: geometries,
        mesh: mesh,
        defaults: require("./defaults")(adapter)
    };
};