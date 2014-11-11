"use strict";

var $ = require('zepto-browserify').$;

module.exports = function(THREE) {
    return {
        createScene: function(initialWidth, initialHeight) {
            var threeJsScene = new THREE.Scene();

            if (true) {        
                threeJsScene.add(require("./inch-debug-outside-in-grid")(initialWidth, initialHeight, 75));
            }
            if (false) {
                threeJsScene.add(require("./inch-debug-axes")(100));
            }

            return threeJsScene;
        },
        createRenderer: function(initialWidth, initialHeight) {
            var renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(initialWidth, initialHeight);

            return renderer;
        },
        attachRenderer: function(element, renderer) {
            $("#"+element).append(renderer.domElement);
        }
    };
};