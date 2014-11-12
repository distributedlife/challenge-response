"use strict";

var _ = require('lodash');
var $ = require('zepto-browserify').$;

module.exports = function(THREE, config) {
    _.defaults(config, {
        dimensions: require('inch-dimensions-widescreen')(require('window')),
        layoutIcons: require("inch-widescreen-icons"),
        updateLoop: require("inch-vsync-update-loop")(require('window')),
        display_config: {
            controls: []
        },
        engine: require("./inch-threejs-engine"),
        element: "canvas",
        //level: require("inch-display-welcome")(THREE)
        camera: require('inch-perspective-camera')(THREE),
        behaviour: require("./standard_display_behaviour")(THREE)
    });
    //require('inch-debug-top-left-aligned-grid');

    var engine = config.engine(config);
    engine.resize();
    
    $(require('window')).on('load resize', engine.resize.bind(engine));

    return engine;
};