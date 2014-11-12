"use strict";

var _ = require('lodash');
var $ = require('zepto-browserify').$;
var pendingAcknowledgements = require('inch-socket-pending-acknowledgements')();

module.exports = function(THREE, window, config) {
    _.defaults(config, {
        dimensions: require('inch-dimensions-widescreen')(require('window')),
        layoutIcons: require("inch-widescreen-icons"),
        updateLoop: require("inch-vsync-update-loop")(require('window')),
        display_config: {
            controls: []
        },
        element: "canvas",
        camera: require('inch-perspective-camera')(THREE),
        behaviour: require("./standard_display_behaviour")(THREE),
        socketBehaviour: require('inch-socket-behaviour-desktop'),
        connectDisconnectBehaviour: require("inch-connect-disconnect-behaviour"),
        debug: [
        ]
    });

    var display = config.behaviour(config, pendingAcknowledgements.ackLast, pendingAcknowledgements.add);
    var socket = config.socketBehaviour(window, config, pendingAcknowledgements.flush);
    socket.connect(display.setup, display.update);

    var resizeCanvas = function () {
        var dims = config.dimensions(config.ratio);
        config.layoutIcons(dims.orientation);

        $("#" + config.element).css("margin-top", dims.margin);
        $("#" + config.element).css("width", dims.usableWidth);
        $("#" + config.element).css("height", dims.usableHeight);

        display.resize(dims);
    };

    $(require('window')).on('load resize', resizeCanvas);

    return {
        run: config.updateLoop(display.updateDisplay).run
    };
};