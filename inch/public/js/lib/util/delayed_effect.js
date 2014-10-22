define([], function() {
	"use strict";

	return function(duration, on_complete) {
		var age = 0;
		var done = function() { 
			return duration === 0 ? true : age >= duration; 
		};

		return {
			tick: function(dt) {
				age += dt;

				if (done()) {
					if (on_complete !== undefined) {
						on_complete();
					}

					on_complete = undefined;
				}
			},
			is_alive: function() { return !done(); }
		};
	};
});