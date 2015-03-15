"use strict";

var each = require('lodash').each;
var $ = require('zepto-browserify').$;
var pendingAcknowledgements = require('../../inch-socket-pending-acknowledgements/src/index.js')();

module.exports = function (pluginManager) {
    each(pluginManager.get("Font"), function (font) {
        font.load();
    });

    return {
        assembleAndRun: function () {
            var display = pluginManager.get('DisplayBehaviour').Display(pendingAcknowledgements.ackLast, pendingAcknowledgements.add);
            var socket = pluginManager.get("SocketBehaviour").SocketBehaviour(pendingAcknowledgements.flush);
            socket.connect(display.setup, display.update);

            var resizeCanvas = function () {
                var dims = pluginManager.get('Dimensions').Dimensions();
                pluginManager.get("IconLayout").IconLayout(dims.orientation);

                var element = pluginManager.get('Element');
                $("#" + element).css("margin-top", dims.marginTopBottom);
                $("#" + element).css("width", dims.usableWidth);
                $("#" + element).css("height", dims.usableHeight);

                display.resize(dims);
            };

            $(pluginManager.get('Window')).on('load resize', resizeCanvas);
            pluginManager.get("UpdateLoop").UpdateLoop(display.updateDisplay).run();
        }
    };
};