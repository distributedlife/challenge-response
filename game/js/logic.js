module.exports = function(game_state) {
  "use strict";

  return {
    update: function(dt) {
      game_state.controller.update(dt);
    }
  }
};