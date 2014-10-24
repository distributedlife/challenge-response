var _ = require('lodash');

module.exports = function(game_state, user_input, action_map, watchjs) {
	var input_bindings = {
		parse_keys_and_buttons: function(callback) {
			_.each(user_input.raw_data.keys, function(key) {
				if (action_map[key] === undefined) { return; }

				_.each(action_map[key], function(action) { 
					if (!action.keypress) {
						callback(action.target, action.func);
					}					
				});
			});

			_.each(user_input.raw_data.single_press_keys, function(key) {
				if (action_map[key] === undefined) { return; }

				_.each(action_map[key], function(action) { 
					if (action.keypress) {
						callback(action.target, action.func);	
					}
				});
			});
		},
		parse_touches: function(callback) {
			_.each(user_input.raw_data.touches, function(touch) {
				var key = "touch"+touch.id;
				if (action_map[key] === undefined) { return; }

				_.each(action_map[key], function(action) { 
					callback(action.target, action.func, touch.x, touch.y);
				});
			});
		},
		parse_sticks: function(callback) {
			_.each(['left_stick', 'right_stick'], function(key) {
				if (user_input.raw_data[key] === undefined) {return;}
				if (action_map[key] === undefined) { return; }

				var data = user_input.raw_data[key];
				_.each(action_map[key], function(action) { 	
					callback(action.target, action.func, data.x, data.y, data.force);
				});
			});
		},
		map_input_to_action: function() {
			var data = {
				rcvd_timestamp: user_input.rcvd_timestamp
			};

			this.parse_keys_and_buttons(function(target, func) {
				game_state[target][func](1.0, data);
			});

			this.parse_touches(function(target, func, x, y) {
				game_state[target][func](x, y, data);
			});

			this.parse_sticks(function(target, func, x, y, force) {
				game_state[target][func](x, y, force, data);
			});

			if (action_map['cursor'] !== undefined) {
				_.each(action_map['cursor'], function(action) {
					var target = action.target;
					var func = action.func;

					var cx = user_input.raw_data.x;
					var cy = user_input.raw_data.y;
					game_state[target][func](cx, cy, data);
				});
			}
		},
		handle_no_input: function() {
			if (action_map['nothing'] === undefined) {
				return;
			}

			var recieved_input = [];
			this.parse_keys_and_buttons(function(target, func) {
				recieved_input.push(target);
			});

			this.parse_touches(function(target, func, x, y) {
				recieved_input.push(target);
			});

			_.each(action_map['nothing'], function(action) {
				var target = action.target;
				var func = action.func;

				if (recieved_input.indexOf(target) === -1) {
					game_state[target][func]();
				}
			});
		}
	};

	watchjs.watch(user_input, input_bindings.handle_no_input.bind(input_bindings));
	return input_bindings;
};