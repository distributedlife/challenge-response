var rek = require('rekuire');
var requirejs = rek('requirejs');

module.exports = function(game_state, game_logic, input_bindings) {  
  var prior_step_time = Date.now();

  return {
    step: function(prior_step_time) {
      if (game_state.paused) {
        return Date.now();
      }

      var now = Date.now();
      var dt = (now - prior_step_time) / 1000;
      
      game_state.duration += dt;
      input_bindings.map_input_to_action();
      game_logic.update(dt);

      return Date.now();
    },
    run: function() {
      prior_step_time = this.step(prior_step_time);
      setTimeout(this.run.bind(this), 1000 / 120);
    }
  };
};