var _ = require('lodash');

module.exports = {
	inactive_things: function(things) {
		return _.where(things, {active: true});
	},

	static_things: function(things) {
		return _.reject(things, function(thing) { return thing.update === undefined; });
	},

	things_that_cant_collide: function(things) {
		return _.reject(things, function(thing) { return thing.collide === undefined; });
	},

	active_temporary_things: function(things) {
		return _.select(things, function(thing) { return thing.is_alive() === true; });
	}
}