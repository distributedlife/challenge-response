var rek = require('rekuire')
var _ = rek('lodash');
var requirejs = rek('requirejs');
var config = requirejs('framework/config');

module.exports = {
	update_each_thing: function(things, dt) {
		_.each(things, function(thing) { thing.update(dt); });
	},

	build_wireframes: function(things) {
		if (!config.wireframe) {
			return [];
		}

        return _.map(things, function(thing) {
			return {
				id: thing.id,
				boxes: _.map([].concat(thing.box()), function(box) { return box.dimensions(); }),
				colliding: thing.colliding || false, //NOTE: thing.colliding is only true if you do the collision detection first
  			};
        });
    },

    is_off_screen: function(thing, dimensions) {
      if (thing.box().bottom() < 0) { return true; }
      if (thing.box().top() > dimensions.height) { return true; }

      return false;
    }
};