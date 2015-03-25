"use strict";

module.exports = {
  type: 'GameMode-Practice',
  deps: ['DefinePlugin', "GameBehaviour-Controller"],
  func: function(DefinePlugin, Controller) {
    return function() {
      DefinePlugin()("StateSeed", function () {
        return {
          controller: {
            start: 0,
            score: 0,
            state: 'ready',
            priorScores: []
          }
        };
      });

      DefinePlugin()("ActionMap", function () {
        return {
          'space': [{target: Controller().response, keypress: true}],
          'r': [{target: Controller().reset, keypress: true}]
        };
      });

      DefinePlugin()("AcknowledgementMap", function () {
        return {
          'show-challenge': [{
            target: Controller().challengeSeen
          }]
        };
      });
    };
  }
};