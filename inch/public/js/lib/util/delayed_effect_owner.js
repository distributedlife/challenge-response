define(["lodash", 'lib/util/delayed_effect'], function(_, delayed_effect) {
	"use strict";

	return function(owner) {
		var effects = [];

		var prune = function() {
			return _.reject(effects, function(t) { 
				return !t.is_alive(); 
			});
		};	

		var old_update_func = owner.update;
		
		owner.add_delayed_effect = function(duration, on_complete) {
			effects.push(Object.create(delayed_effect(duration, on_complete)));
		},
		owner.update = function(dt) {
			old_update_func(dt);

			_.each(effects, function(effect) { 
				effect.tick(dt);
			});

			prune();
		},
		owner.cancel_all = function() {
			_.each(effects, function(effect) {
				effect.cancel();
			});
		}
	};
});