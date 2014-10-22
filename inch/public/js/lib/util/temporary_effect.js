define([], function() {
	"use strict";

	return function(duration, on_tick_func) {
		on_tick_func = on_tick_func || function() {};

		var age = 0;
		var progress = function() { 
			return duration === 0 ? 0.0 : age / duration; 
		};

		return {
			tick: function(dt) {
				age += dt;
				on_tick_func(dt, progress());
			},
			is_alive: function() { return (age < duration || duration === 0); }
		};
	};
});