"use strict";

var _ = require('lodash');

module.exports = function(isPaused, updateCallbacks) {
  var priorStepTime = Date.now();

  var updateArray = function(dt) {
    _.each(updateCallbacks, function(callback) {
      callback(dt);
    });
  };

  var update = _.isArray(updateCallbacks) ? updateArray : updateCallbacks;

  return {
    step: function(priorStepTime) {
      var now = Date.now();

      if (isPaused()) {
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