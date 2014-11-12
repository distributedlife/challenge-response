"use strict";

var _ = require("lodash");
var $ = require('zepto-browserify').$;
var pendingAcknowledgements = require('inch-socket-pending-acknowledgements')();

module.exports = function (config, window) {	
	var display = config.behaviour(config, pendingAcknowledgements.ackLast, pendingAcknowledgements.add);

	var socketBehaviour = config.socketBehaviour(window, config, pendingAcknowledgements.flush);
	socketBehaviour.connect(display.setup, display.update);

	return {
		resize: function () {
			var dims = config.dimensions(config.ratio);
			config.layoutIcons(dims.orientation);

			$("#"+config.element).css("margin-top", dims.margin);
			$("#"+config.element).css("width", dims.usableWidth);
			$("#"+config.element).css("height", dims.usableHeight);

			display.resize(dims);
		},
		run: config.updateLoop(display.updateDisplay.bind(display)).run
	};
};