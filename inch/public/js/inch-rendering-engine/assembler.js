"use strict";

var _ = require('lodash');
var $ = require('zepto-browserify').$;
var window = require('window');

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
        camera: require('inch-perspective-camera')(THREE),
        behaviour: require("./standard_display_behaviour")(THREE),
        socketBehaviour: require('inch-socket-behaviour-desktop'),
        connectDisconnectBehaviour: require("./inch-connect-disconnect-behaviour")
    });

    var engine = config.engine(config, window);
    engine.resize();
    
    $(require('window')).on('load resize', engine.resize.bind(engine));

    return engine;
};