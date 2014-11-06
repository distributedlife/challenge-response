"use strict";

var THREE = require('inch-threejs');
var $ = require('zepto-browserify').$;
var grid_view = require("./grid_view");
var axes = require("./axes");
var config = require("../framework/config");

module.exports = {
    create_scene: function(initial_width, initial_height) {
        var threeJsScene = new THREE.Scene();

        if (config.grid.enabled) {        
            threeJsScene.add(Object.create(grid_view(initial_width, initial_height, config.grid)).grid);
        }
        if (config.axes.enabled) {
            var scene_axes = axes.build(100);
            threeJsScene.add(scene_axes);
        }

        return threeJsScene;
    },
    create_and_attach_renderer: function(element, initial_width, initial_height) {
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(initial_width, initial_height);

        $("#"+element).append(renderer.domElement);

        return renderer;
    }
}