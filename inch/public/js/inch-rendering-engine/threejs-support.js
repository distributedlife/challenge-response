"use strict";

var $ = require('zepto-browserify').$;
var _ = require('lodash');

module.exports = function(THREE, config) {
    return {
        createScene: function(initialWidth, initialHeight) {
            var threeJsScene = new THREE.Scene();

            _.each(config.debug, function (guide) {
                threeJsScene.add(guide(initialWidth, initialHeight));
            })

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