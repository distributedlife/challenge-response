define(["lodash"], function(_) {
	"use strict";

	return {
		align_to_self: function(position, width, height, options) {
			_.defaults(options, {
				horizontal: "centre",
				vertical: "centre"
			});

			var new_position = {x: 0, y: 0, z: 0};
			var resolved_position_values = {
				x: typeof position.x === 'function' ? position.x() : position.x,
				y: typeof position.y === 'function' ? position.y() : position.y,
				z: typeof position.z === 'function' ? position.z() : position.z
			}

			if (options.horizontal === "left") {
				new_position.x = resolved_position_values.x;
			} else if (options.horizontal === "right") {
				new_position.x = resolved_position_values.x - width;
			} else {
				new_position.x = resolved_position_values.x - (width / 2);
			}

			if (options.vertical === "top") {
				new_position.y = resolved_position_values.y + height;
			} else if (options.vertical === "bottom") {
				new_position.y = resolved_position_values.y;
			} else {
				new_position.y = resolved_position_values.y + (height / 4);
			}

			return new_position;
		}
	}
})