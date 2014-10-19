define(["ext/three"], function(THREE) {
  "use strict";
  
  return function(model, texture_filename, options) {
    _.defaults(options, {
      transparent: true,
      alphaTest: 0.1,
      blending: THREE.AdditiveBlending,
      scale: 1.0,
      opacity: 1.0
    });

    var geometry = new THREE.PlaneGeometry(model.width, model.height);
    var material = new THREE.MeshBasicMaterial({ 
      map: THREE.ImageUtils.loadTexture(texture_filename),
      transparent: options.transparent,
      alphaTest: options.alphaTest,
      blending: options.blending,
      opacity: options.opacity
    });
    
    var mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = model.x;
    mesh.position.y = model.y;
    mesh.position.z = model.z || 0;
    mesh.rotation.x = -90;
    mesh.scale.set(options.scale, options.scale, options.scale);

    return {
      mesh: mesh,

      update_from_model: function(updated_model) {
        this.mesh.position.x = updated_model.x;
        this.mesh.position.y = updated_model.y;
        this.mesh.visible = updated_model.active;
      }
    }
  };
});
