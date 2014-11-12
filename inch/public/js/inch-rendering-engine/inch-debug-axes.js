"use strict";

module.exports = function(THREE, length) {
    var buildAxis = function (src, dst, colorHex, dashed) {
        var geometry = new THREE.Geometry();
        var options = {linewidth: 3, color: colorHex};

        if (dashed) {
            options.dashSize = 3;
            options.gapSize = 3;
        }

        var material = new THREE.LineBasicMaterial(options);

        geometry.vertices.push(src.clone());
        geometry.vertices.push(dst.clone());
        geometry.computeLineDistances();

        var axis = new THREE.Line(geometry, material, THREE.LinePieces);
        axis.visible = true;

        return axis;
    };

    return function(initialWidth, initialHeight) {
        var axes = new THREE.Object3D();

        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0),  0xFF0000, false));
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xFF0000, true));
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0),  0x00FF00, false));
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00FF00, true));
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length),  0x0000FF, false));
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000FF, true));

        return axes;
    };
};