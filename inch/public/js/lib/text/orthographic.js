define(["vendor/three", "lib/util/temporary_effect", "lib/math/alignment", "lib/math/lerp", "lib/util/supports_transitions", "lib/ui/apply_defaults"], function(THREE, a_temporary_effect, alignment, lerp, supports_transitions, apply_defaults) {
  "use strict";

  return function(initialText, on_create, on_destroy, settings) {
    var current = {};
    _.defaults(current, apply_defaults(settings));

    var createMeshFromText = function(textToDisplay) {
      var shape = THREE.FontUtils.generateShapes(textToDisplay, current);
      
      var geometry = new THREE.ShapeGeometry(shape);
      geometry.computeBoundingBox();

      var material = new THREE.MeshBasicMaterial({
        transparent: current.transparent,
        alphaTest: current.alphaTest,
        blending: current.blending,
        opacity: current.colour.current[3]
      });
      material.color.setRGB(current.colour.current[0], current.colour.current[1], current.colour.current[2]);  
      
      var new_mesh = new THREE.Mesh(geometry, material);
      new_mesh.position = alignment.align_to_self(current.position, new_mesh.geometry.boundingBox.max.x - new_mesh.geometry.boundingBox.min.x, new_mesh.geometry.boundingBox.max.y - new_mesh.geometry.boundingBox.min.y, current.alignment);
      new_mesh.rotation.x = -90; 
      new_mesh.scale.set(current.scale.current, current.scale.current, current.scale.current);

      on_create(new_mesh);

      return new_mesh; 
    };

    var mesh = createMeshFromText(initialText);

    var orthographic_text = {
      width: function() { return mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x; },
      height: function() { return mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y; },

      update_from_model: function(updated_model) {
        current.position = {x: updated_model.x, y: updated_model.y, z: 0};
        mesh.position = alignment.align_to_self(current.position, this.width(), this.height(), current.alignment);
        mesh.visible = updated_model.active || true;
      },

      update_text: function(updatedText) {
        var is_visible = mesh.visible;

        on_destroy(mesh);

        mesh = createMeshFromText(updatedText);
        mesh.position = alignment.align_to_self(current.position, this.width(), this.height(), current.alignment);
        mesh.visible = is_visible;

        this.update_mesh(mesh);
      },


      on_tick: function(dt) {
        if (!this.is_alive()) {
          mesh.visible = false;
        }

        this.run_transitions(dt);
      }
    };
    _.extend(orthographic_text, supports_transitions(mesh, current));
    _.extend(orthographic_text, a_temporary_effect(current.duration, orthographic_text.on_tick.bind(orthographic_text)));

    return orthographic_text;
  }
});
