var THREE = require('inch-threejs');
var alignment = require('../math/alignment');

"use strict";

var width = function(mesh) { 
    if (mesh.geometry.boundingBox) {
        return mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x; 
    } else {
        return mesh.geometry.boundingSphere.radius * 2; 
    }
};

var height = function(mesh) { 
    if (mesh.geometry.boundingBox) {
        return mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y;
    } else {
        return mesh.geometry.boundingSphere.radius * 2; 
    }
};

var materials = {
    basic: function(options) {
        var material = new THREE.MeshBasicMaterial({
            transparent: options.transparent,
            alphaTest: options.alphaTest,
            blending: options.blending,
            opacity: options.opacity
        });
        material.color.setRGB(options.colour[0], options.colour[1], options.colour[2]);  

        return material;
    }
};

var geometries = {
    circle: function(options) {
        return new THREE.CircleGeometry(options.radius, options.segments);  
    },
    text: function(options) {
        var shape = THREE.FontUtils.generateShapes(options.text, options);
  
        var geometry = new THREE.ShapeGeometry(shape);
        geometry.computeBoundingBox();

        return geometry;
    }
};

var mesh = {
    width: width,
    height: height,
    assemble: function(geometry_callback, material_callback, position_callback, on_create, options) {
        var new_mesh = new THREE.Mesh(geometry_callback(options), material_callback(options));

        var new_position = alignment.align_to_self(position_callback(new_mesh), width(new_mesh), height(new_mesh), options.alignment);
        new_mesh.position.set(new_position.x, new_position.y, new_position.z);
        new_mesh.rotation.x = -90; 
        new_mesh.scale.set(options.scale, options.scale, options.scale);
        new_mesh.visible = true;

        on_create(new_mesh);

        return new_mesh;
    }
};

module.exports = {
    materials: materials,
    geometries: geometries,
    mesh: mesh,
};