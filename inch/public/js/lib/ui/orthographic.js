define(["lodash", "vendor/three", "framework/config", "framework/ui/grid_view", "framework/ui/standard_display_behaviour", "framework/ui/axes", "vendor/window"], 
  function(_, THREE, config, grid_view, standard_display_behaviour, axes, window) {
  "use strict";

  return function(element, width, height, options, setup_func, update_func) {
    var setup_camera = function() {
      var camera = new THREE.OrthographicCamera(0, width, 0, height, -2000, 1000);
      camera.position.z = 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      return camera;
    };

    var create_a_scene = function() {
      var scene = new THREE.Scene();
      
      if (config.grid.enabled) {        
        scene.add(Object.create(grid_view(width, height, config.grid)).grid);
      }

      return scene;
    };

    var build_scene_renderer = function(scene, camera) {
      var renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      window.document.getElementById(element).appendChild(renderer.domElement);

      return renderer;
    };

    var camera = setup_camera();
    var scene = create_a_scene();
    var renderer = build_scene_renderer(scene, camera);

    var things_in_scene = [];

    var scene_manager = {
      add: function() {
        _.each(arguments, function(mesh) { 
          scene.add(mesh); 
          things_in_scene.push(mesh);
        }.bind(this)); 
      },
      remove: function() {
        _.each(arguments, function(mesh) { 
          scene.remove(mesh); 

          var i = things_in_scene.indexOf(mesh);
          things_in_scene.splice(i, 1);

        }.bind(this));
      },
      reset: function() {
        _.each(things_in_scene, function(mesh) {
          scene.remove(mesh);
        });

        things_in_scene = [];
      }
    };


    var display = Object.create(standard_display_behaviour(element, width, height, options, setup_func, update_func));
    _.extend(display, {
      expired_effects_func: function(expired_effects) {
        _.each(expired_effects, function(expired_effect) {  this.remove_from_scene(expired_effect.mesh); });
      },

      //TODO: move to scene management
      add_to_scene: function() {
        scene_manager.add.apply(this, arguments);
      },
      remove_from_scene: function() {
        scene_manager.remove.apply(this, arguments);
      },
      reset: function() {
        scene_manager.reset();
      },
      scene_manager: function() {
        return scene_manager;
      },

      animate: function(dt) {
        renderer.render(scene, camera); 

        if (this.setup_complete) {
          this.tick(dt); 
        }
      },
      resize: function(width, height) {
        display.__proto__.resize(width, height);
        
        renderer.setSize(this.dimensions(width, height).width, this.dimensions(width, height).height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // _.each(this.permanent_effects, function(permanent_effect) { permanent_effect.reposition(); });
        // _.each(this.temporary_effects, function(temporary_effect) { temporary_effect.reposition(); });
      }
    });    

    return display;
  };
});
