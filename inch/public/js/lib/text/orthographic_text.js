define(["ext/three", "lib/temporary_effect", "lib/alignment", "lib/math"], function(THREE, temporary_effect, alignment, math) {
  "use strict";

  return function(initialText, options) {
    _.defaults(options, {
      transparent: false,
      alphaTest: 0.1,
      blending: THREE.AdditiveBlending,
      size: 20,
      duration: 0,
      alignment: {
        horizontal: "centre",
        vertical: "centre"
      },
      scale: {
        from: 1.0,
        to: 1.0
      },
      colour: {
        from: [1.0, 1.0, 1.0, 1.0],
        to: [1.0, 1.0, 1.0, 1.0]
      },
      position: {x: 0, y: 0, z: 0}
    });

    var createMeshFromText = function(textToDisplay) {
      var shape = THREE.FontUtils.generateShapes(textToDisplay, options);
      
      var geometry = new THREE.ShapeGeometry(shape);
      geometry.computeBoundingBox();

      var material = new THREE.MeshBasicMaterial({
        transparent: options.transparent,
        alphaTest: options.alphaTest,
        blending: options.blending,
        opacity: options.colour.from[3]
      });
      material.color.setRGB(options.colour.from[0], options.colour.from[1], options.colour.from[2]);  
      
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = options.position.x;
      mesh.position.y = options.position.y;
      mesh.position.z = options.position.z;
      mesh.rotation.x = -90; 
      mesh.scale.set(options.scale.from, options.scale.from, options.scale.from);

      return mesh; 
    };

    var orthographic_text = {
      mesh: createMeshFromText(initialText),
      position: options.position,

      width: function() { return this.mesh.geometry.boundingBox.max.x - this.mesh.geometry.boundingBox.min.x; },
      height: function() { return this.mesh.geometry.boundingBox.max.y - this.mesh.geometry.boundingBox.min.y; },

      update_from_model: function(updated_model) {
        this.position = {x: updated_model.x, y: updated_model.y, z: 0};
        this.mesh.position = alignment.align_to_self(this.position, this.width(), this.height(), options.alignment);
        this.mesh.visible = updated_model.active || true;
      },

      update_text: function(updatedText, scene) {
        var is_visible = this.mesh.visible;

        scene.remove(this.mesh);

        this.mesh = createMeshFromText(updatedText);
        this.mesh.position = alignment.align_to_self(this.position, this.width(), this.height(), options.alignment);
        this.mesh.visible = is_visible;

        scene.add(this.mesh);
      },

      on_tick: function(dt) {
        if (!this.is_alive()) {
          this.mesh.visible = false;
        }

        var scale = math.lerp(options.scale.from, options.scale.to, this.progress());
        this.mesh.scale.set(scale, scale, scale);

        var rgba = math.lerpRGBA(options.colour.from, options.colour.to, this.progress());
        this.mesh.material.color.setRGB(rgba[0], rgba[1], rgba[2]);  
        this.mesh.material.opacity = rgba[3];
        this.mesh.material.needsUpdate = true;
      }
    };
    _.extend(orthographic_text, temporary_effect(options.duration, orthographic_text.on_tick.bind(orthographic_text)));

    return orthographic_text;
  }
});
