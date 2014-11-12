"use strict";

var _ = require("lodash");
var $ = require('zepto-browserify').$;

module.exports = function (config) {	
	var display = config.behaviour(config);
	display.connect_to_server();

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