"use strict";

var each = require('lodash').each;
var isArray = require('lodash').isArray;

module.exports = {
  type: "ServerSideEngine",
  deps: ["ServerSideUpdate", "IsPaused"],
  func: function (ServerSideUpdate, IsPaused) {
    return function() {
      var priorStepTime = Date.now();

      var updateArray = function(dt) {
        each(ServerSideUpdate(), function(callback) {
          callback(dt);
        });
      };

      var update = isArray(ServerSideUpdate()) ? updateArray : ServerSideUpdate();

      return {
        step: function(priorStepTime) {
          var now = Date.now();

          if (IsPaused()()) {
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