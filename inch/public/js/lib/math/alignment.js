define([], function() {
	"use strict";

	return {
		align_to_self: function(position, width, height, options) {
			_.defaults(options, {
				horizontal: "centre",
				vertical: "centre"
			});

			var new_position = {x: 0, y: 0, z: 0};

			if (options.horizontal === "left") {
				new_position.x = position.x;
			} else if (options.horizontal === "right") {
				new_position.x = position.x - width;
			} else {
				new_position.x = position.x - (width / 2);
			}

			if (options.vertical === "top") {
				new_position.y = position.y + height;
			} else if (options.vertical === "bottom") {
				new_position.y = position.y;
			} else {
				new_position.y = position.y + (height / 2);
			}

			return new_position;
		}
	}
})