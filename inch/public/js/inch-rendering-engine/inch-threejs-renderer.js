module.exports = function (config) {
	var rendering_engine = require("./engine");
	//TODO: require('inch-dimensions-widesreen'), require('inch-dimensions-fillscreen')
	var dimensions = require("./dimensions");
	//TODO: require('inch-overlay-icons'); require('inch-overlay-no-icons');
	var layout_icons = require("./layout_icons");
	var $ = require('zepto-browserify').$;

var standard_display_behaviour = require("./standard_display_behaviour");
	// element, initial_width, initial_height, options, setupFunc, animate

	var display = Object.create(standard_display_behaviour(
		config.element, 
		config.width, 
		config.height, 
		config.display_config, 
		config.setup,
		config.camera
	));
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
		run: engine.run
	};
};