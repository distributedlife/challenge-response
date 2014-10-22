define(["vendor/three", "lib/util/temporary_effect", "lib/math/alignment", "lib/math/lerp", "lib/util/supports_transitions"], function(THREE, is_a_temporary_effect, alignment, lerp, supports_transitions) {
  "use strict";

  return function(initialText, on_create, on_destroy, options) {
    options = options || {};
    
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
      position: {x: 0, y: 0, z: 0},
      start_hidden: false
    });

    if (options.start_hidden) {
      options.transparent = true;
      options.colour.from[3] = 0.0;
    }

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
      mesh.position = alignment.align_to_self(options.position, mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x, mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y, options.alignment);
      mesh.rotation.x = -90; 
      mesh.scale.set(options.scale.from, options.scale.from, options.scale.from);

      on_create(mesh);

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

      reposition: function() {
        this.mesh.position = alignment.align_to_self(this.position, this.width(), this.height(), options.alignment);
      },

      update_text: function(updatedText) {
        var is_visible = this.mesh.visible;

        on_destroy(this.mesh);

        this.mesh = createMeshFromText(updatedText);
        this.mesh.position = alignment.align_to_self(this.position, this.width(), this.height(), options.alignment);
        this.mesh.visible = is_visible;

        on_create(this.mesh);
        this.update_mesh(this.mesh);
      },


      on_tick: function(dt) {
        if (!this.is_alive()) {
          this.mesh.visible = false;
        }

        this.run_transitions(dt);
      }
    };
    _.extend(orthographic_text, supports_transitions(orthographic_text.mesh, options));
    _.extend(orthographic_text, is_a_temporary_effect(options.duration, orthographic_text.on_tick.bind(orthographic_text)));

    return orthographic_text;
  }
});
