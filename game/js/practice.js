"use strict";

var inchThreeJsRenderer = function (config) {
	var rendering_engine = require("../../inch/public/js/client_core/engine");
	//TODO: require('inch-dimensions-widesreen'), require('inch-dimensions-fillscreen')
	var dimensions = require("../../inch/public/js/client_core/dimensions");
	//TODO: require('inch-overlay-icons'); require('inch-overlay-no-icons');
	var layout_icons = require("../../inch/public/js/client_core/layout_icons");
	var $ = require('zepto-browserify').$;

	var orthographic_display = require("../../inch/public/js/lib/ui/orthographic");
	
	var display = Object.create(orthographic_display(config.element, config.width, config.height, config.display_config, config.setup));
	display.connect_to_server();

	var engine = rendering_engine(display.update_display.bind(display));

	return {
		resize: function () {
			var dims = dimensions(config.ratio);

			layout_icons(dims.orientation);

			//layout screen('inch-dimensions-widescreen')
			$("#"+config.element).css("margin-top", dims.margin);
			$("#"+config.element).css("width", dims.usable_width);
			$("#"+config.element).css("height", dims.usable_height);

			display.resize(dims);
		},
		run: function () {
			engine.run();
		}
	};
};

//TODO: can we replace the keyboard and gamepad values with modules?
//TODO: replace inchThreeJsRenderer with require(inch-three-js-renderer)
var engine_config = {
	display_config: {
		controls: ['keyboard', 'gamepad']
	},
	setup: require("./levels/default"),
	renderer: inchThreeJsRenderer,
	ratio: 26/10
};

Object.create(require('../../inch/public/js/client_core/assembler')(engine_config)).run();