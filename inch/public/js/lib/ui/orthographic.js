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

    var display = Object.create(standard_display_behaviour(element, width, height, options, setup_func, update_func));
    _.extend(display, {
      camera: camera,
      scene: scene,
      things_in_scene: [],
      renderer: renderer,

      expired_effects_func: function(expired_effects) {
        _.each(expired_effects, function(expired_effect) {  this.remove_from_scene(expired_effect.mesh); });
      },

      dimensions: function(width, height) {
        if (this.current_state === null) {
          return {width: width, height: height};
        } else {
          return {
            width: width * width / this.current_state.dimensions.width, 
            height: height * height / this.current_state.dimensions.height
          };
        }
      },
      
      //TODO: move to scene management
      add_to_scene: function() {
        _.each(arguments, function(mesh) { 
          display.scene.add(mesh); 
          display.things_in_scene.push(mesh);
        }.bind(display)); 
      },
      remove_from_scene: function() {
        _.each(arguments, function(mesh) { 
          display.scene.remove(mesh); 

          var i = display.things_in_scene.indexOf(mesh);
          display.things_in_scene.splice(i, 1);

        }.bind(display));
      },
      reset: function() {
        _.each(display.things_in_scene, function(thing_in_scene) {
          display.scene.remove(thing_in_scene);
        });

        display.things_in_scene = [];
      },
      animate: function(dt) {
        this.renderer.render(display.scene, display.camera); 

        if (this.setup_complete) {
          this.tick(dt); 
        }
      },
      resize: function(width, height) {
        display.__proto__.resize(width, height);
        display.renderer.setSize(this.dimensions(width, height).width, this.dimensions(width, height).height);

        display.camera.aspect = width / height;
        display.camera.updateProjectionMatrix();
      }
    });    

    return display;
  };
});
