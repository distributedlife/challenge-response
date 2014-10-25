define(["lodash", "vendor/three", "framework/config", "framework/ui/grid_view", "framework/ui/standard_display_behaviour", "framework/ui/axes", "vendor/window", 'lib/ui/wireframe'], 
  function(_, THREE, config, grid_view, standard_display_behaviour, axes, window, wireframe) {
  "use strict";

  return function(element, width, height, options, setup_func, update_func) {
    var setup_camera = function() {
      var camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
      camera.position.z = 100;
      return camera;
    };

    var create_a_scene = function() {
      var scene = new THREE.Scene();

      if (config.axes.enabled) {
        var scene_axes = axes.build(100);
        scene.add(scene_axes);
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

    var wrapped_setup_func = function() {
      display.on_element_arrival(display.all('wireframes'), display.add_wireframe);
      display.on_element_change(display.all('wireframes'), display.move_wireframe);
      display.on_element_removal(display.all('wireframes'), display.remove_wireframe);

      setup_func();
    }

    var display = Object.create(standard_display_behaviour(element, width, height, options, wrapped_setup_func, update_func));
    _.extend(display, {
      camera: camera,
      scene: scene,
      things_in_scene: [],
      renderer: renderer,

      expired_effects_func: function(expired_effects) {
        _.each(expired_effects, function(expired_effect) {  this.remove_from_scene(expired_effect.mesh); });
      },

      dimensions: function(width, height) {
        if (this.has_no_current_state()) {
          return {width: width, height: height};
        } else {
          return {
            width: width * width / this.current_state.dimensions.width, 
            height: height * height / this.current_state.dimensions.height
          };
        }
      },
      
      //TODO: move to scene management
      wireframes: {},
      add_wireframe: function(model, prior_model) {
          if (display.wireframes[model.id] !== undefined) {
              display.wireframes[model.id].show();  
              return;
          }

          var bb_wireframe = new wireframe(model, {});
          _.each(bb_wireframe.meshes, function(mesh) {
              display.add_to_scene(mesh);
          });

          display.wireframes[model.id] = bb_wireframe;
      },
      move_wireframe: function(model, prior_model) {
          if (display.wireframes[model.id] === undefined) { 
              display.add_wireframe(model, prior_model); 
          }

          display.wireframes[model.id].update_from_model(model);
      },
      remove_wireframe: function(model, prior_model) {
          if (display.wireframes[model.id] === undefined) { 
            return; 
          }

          display.wireframes[model.id].hide();  
      },
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
