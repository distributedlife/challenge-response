define(["lib/math/alignment"], function(alignment) {
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
		        opacity: options.colour.current[3]
			});
			material.color.setRGB(options.colour.current[0], options.colour.current[1], options.colour.current[2]);  

			return material;
		}
	};
	var geometries = {
		circle: function(options) {
			return new THREE.CircleGeometry(options.radius, options.segments);	
		}
	};
	var mesh = {
		width: width,
		height: height,
		assemble: function(geometry_callback, material_callback, position_callback, on_create, options) {
    		var new_mesh = new THREE.Mesh(geometry_callback(options), material_callback(options));

			new_mesh.position = alignment.align_to_self(position_callback(), width(new_mesh), height(new_mesh), options.alignment);
      		new_mesh.rotation.x = -90; 
      		new_mesh.scale.set(options.scale.current, options.scale.current, options.scale.current);

      		on_create(new_mesh);

      		return new_mesh;
    	}
	};

	return {
		materials: materials,
		geometries: geometries,
		mesh: mesh,
	};
});