var _ = require("lodash");
var $ = require("zepto-browserify").$;
var THREE = require("three");  
var config = require("../../framework/config");
var grid_view = require("../../framework/ui/grid_view");
var standard_display_behaviour = require("../../framework/ui/standard_display_behaviour");
var axes = require("../../framework/ui/axes");
// var window = require('window');

"use strict";

module.exports = function(element, initial_width, initial_height, options, setup_func) {
  //THIS and resize is really the only difference between perspective and orthographic. 
  //Use modules to bring these in to standard screen behaviour (created by user and passed down)
    // var myDesiredCamera = {
    //   setup: function() { ... },
    //   resize: function() { ... }
    // };

    // require('inch-orthographic-camera');

  var setup_camera = function() {
    var camera = new THREE.OrthographicCamera(0, initial_width, 0, initial_height, -2000, 1000);
    camera.position.z = 1;
    camera.aspect = initial_width / initial_height;
    camera.updateProjectionMatrix();
    return camera;
  };

  var create_a_scene = function() {
    var scene = new THREE.Scene();
    
    if (config.grid.enabled) {        
      scene.add(Object.create(grid_view(initial_width, initial_height, config.grid)).grid);
    }

    return scene;
  };

  var build_scene_renderer = function() {
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(initial_width, initial_height);

    $("#"+element).append(renderer.domElement);

    return renderer;
  };

  var camera = setup_camera();
  var scene = create_a_scene();
  var renderer = build_scene_renderer();

  var things_in_scene = [];

  var scene_manager = {
    add: function() {
      _.each(arguments, function(mesh) { 
        scene.add(mesh); 
        things_in_scene.push(mesh);
      }); 
    },
    remove: function() {
      _.each(arguments, function(mesh) { 
        scene.remove(mesh); 

        var i = things_in_scene.indexOf(mesh);
        things_in_scene.splice(i, 1);
      });
    },
    reset: function() {
      _.each(things_in_scene, function(mesh) {
        scene.remove(mesh);
      });

      things_in_scene = [];
    }
  };

  var animate = function (dt) {
    renderer.render(scene, camera); 
  };

  var setupFunc = function(ackLastRequest, positionHelper, permanent_effects, font_size, stateChanges) {
    setup_func(scene_manager, ackLastRequest, positionHelper, permanent_effects, font_size, stateChanges);
  }

  var display = Object.create(standard_display_behaviour(element, initial_width, initial_height, options, setupFunc, animate));
  _.extend(display, {
    expired_effects_func: function(expired_effects) {
      _.each(expired_effects, function(expired_effect) {  this.remove_from_scene(expired_effect.mesh); });
    },

    resize: function(dims) {
      display.__proto__.resize(dims);

      renderer.setSize(dims.usable_width, dims.usable_height);

      camera.aspect = dims.usable_width / dims.usable_height;
      camera.updateProjectionMatrix();
    }
  });    

  return display;
};