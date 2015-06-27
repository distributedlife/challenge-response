'use strict';

module.exports = {
  type: 'StateSeed',
  func: function () {
    return ['*', {
      controller: {
        start: 0,
        score: 0,
        state: 'ready',
        priorScores: []
      }
    }];
  }
};