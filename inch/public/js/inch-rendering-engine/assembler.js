"use strict";

var _ = require('lodash');
var $ = require('zepto-browserify').$;

module.exports = function(THREE, config) {
    _.defaults(config, {
        dimensions: require("./dimensions"),
        layoutIcons: require("./layout_icons"),
        updateLoop: require("./vSyncUpdateLoop"),
        display_config: {
            controls: []
        },
        engine: require("./inch-threejs-engine"),
        element: "canvas",
        //level: require("inch-display-welcome")(THREE)
        camera: require('inch-perspective-camera')(THREE),
        behaviour: require("./standard_display_behaviour")(THREE),
        extras: [
            require("./inch-enable-fullscreen"),
            require("./inch-extra-toggle-sound")
        ],
        debug: {
            meshes: []
        }
    });
    //require('inch-debug-top-left-aligned-grid');

    var engine = config.engine(config);
    engine.resize();
    
    $(require('window')).on('load resize', engine.resize.bind(engine));

    return engine;
};