define(["vendor/three"], function(THREE) {
  "use strict";
  
  return function(model, options) {
    _.defaults(options, {
      transparent: true,
      alphaTest: 0.1,
      blending: THREE.AdditiveBlending,
      scale: 1.0,
      opacity: 0.5
    });

    var meshes = {};
    var materials = [];

    for(var i = 0; i < model.boxes.length; i++) {
      var geometry = new THREE.PlaneGeometry(model.boxes[i].width, model.boxes[i].height);
      var material = new THREE.MeshBasicMaterial({
        transparent: options.transparent,
        alphaTest: options.alphaTest,
        blending: options.blending,
        opacity: options.opacity
      });

      materials.push(material);

      var mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = model.boxes[i].x;
      mesh.position.y = model.boxes[i].y;
      mesh.position.z = model.boxes[i].z || -1;
      mesh.rotation.x = -90;
      mesh.scale.set(options.scale, options.scale, options.scale);
      
      meshes[i] = mesh;  
    };
  
    return {
      meshes: meshes,

      update_from_model: function(updated_model) {
        for(var i = 0; i < updated_model.boxes.length; i++) {
          this.meshes[i].position.x = updated_model.boxes[i].x;
          this.meshes[i].position.y = updated_model.boxes[i].y;

          _.each(materials, function(material) {
            if (updated_model.colliding) {
              material.color.setRGB(255,0,0);  
            } else {
              material.color.setRGB(255,255,255);
            }
          });
        };
      },

      hide: function() {
        _.each(this.meshes, function(mesh) { mesh.visible = false; });
      },

      show: function() {
        _.each(this.meshes, function(mesh) { mesh.visible = true; });
      }
    }
  };
});
