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

      var step = function(priorStepTime) {
        var now = Date.now();

        if (State().get('inch')('paused')) {
          return now;
        }

        var dt = (now - priorStepTime) / 1000;
        update(dt);

        return now;
      };

      return {
        run: function(frequency) {
          priorStepTime = step(priorStepTime);
          return setTimeout(this.run.bind(this), 1000 / frequency);
        }
      };
    };
  }
};