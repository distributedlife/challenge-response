var rek = require('rekuire');
var filter = rek('inch/public/js/lib/filters/common');
var logic = rek('inch/public/js/lib/logic/common');
var collision_detection = rek('inch/public/js/lib/math/collision_detection');

module.exports = function(game_state, entities) {
  "use strict";

  var permanent_things = [];
  
  var all_the_things = function() {
    return permanent_things.concat(game_state.fires);
  };

  return {
    update: function(dt) {
      var active_things = filter.inactive_things(all_the_things());
      var things_to_update = filter.static_things(active_things);
      var things_that_can_collide = filter.things_that_cant_collide(active_things)

      collision_detection.check_for_collisions_using_aabb(things_that_can_collide);
      game_state.wireframes = logic.build_wireframes(things_that_can_collide);

      logic.update_each_thing(things_to_update, dt);
    }
  }
};