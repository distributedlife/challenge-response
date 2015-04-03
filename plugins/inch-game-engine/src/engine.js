'use strict';

var each = require('lodash').each;

module.exports = {
  type: 'ServerSideEngine',
  deps: ['ServerSideUpdate', 'StateAccess'],
  func: function (serverSideUpdate, state) {
    var priorStepTime = Date.now();

    var update = function(dt) {
      each(serverSideUpdate(), function(callback) {
        callback(dt);
      });
    };

    var step = function(priorStepTime) {
      var now = Date.now();

      if (state().get('inch')('paused')) {
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
  }
};