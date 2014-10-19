var _ = require('underscore');

module.exports = {
	check_for_collisions_using_aabb: function(things) {
		//NOTE: NEST ALL THE LOOPS!
		_.each(things, function(this_thing) {
			var this_thing_boxes = [].concat(this_thing.box());

			_.each(things, function(another_thing) {
				var other_thing_boxes = [].concat(another_thing.box());

				_.each(this_thing_boxes, function(this_thing_box) {
					_.each(other_thing_boxes, function(another_thing_box) {
						
						if(this_thing_box.is_colliding_with(another_thing_box)) {
							this_thing.collide(another_thing);
							another_thing.collide(this_thing);

							return;
						}
						
					});
				});
			});
		});
    },
}