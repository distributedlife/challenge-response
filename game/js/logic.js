var rek = require('rekuire');
var filter = rek('inch/public/js/lib/filters/common');
var logic = rek('inch/public/js/lib/logic/common');
var collision_detection = rek('inch/public/js/lib/math/collision_detection');

module.exports = function(game_state, entities) {
  "use strict";

  var permanent_things = [game_state.controller];
  
  var all_the_things = function() {
    return permanent_things;
  };

  return {
    update: function(dt) {
      var active_things = filter.inactive_things(all_the_things());
      var things_to_update = filter.static_things(active_things);

      logic.update_each_thing(things_to_update, dt);
    }
  }
};