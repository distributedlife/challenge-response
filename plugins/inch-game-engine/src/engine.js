"use strict";

var each = require('lodash').each;
var isArray = require('lodash').isArray;

module.exports = {
  type: "ServerSideEngine",
  deps: ["ServerSideUpdate", "StateAccess"],
  func: function (ServerSideUpdate, State) {
    return function() {
      var priorStepTime = Date.now();

      var update = function(dt) {
        each(ServerSideUpdate(), function(callback) {
          callback(dt);
        });
      };

      return {
        step: function(priorStepTime) {
          var now = Date.now();

          if (State().get('inch')('paused')) {
            return now;
          }

          var dt = (now - priorStepTime) / 1000;
          update(dt);

          return now;
        },
        run: function(frequency) {
          priorStepTime = this.step(priorStepTime);
          setTimeout(this.run.bind(this), 1000 / frequency);
        }
      };
    };
  }
};