'use strict';

module.exports = {
  type: 'GameMode-Practice',
  deps: ['DefinePlugin', 'GameBehaviour-Controller'],
  func: function(definePlugin, controller) {
    return function() {
      definePlugin()('StateSeed', function () {
        return {
          controller: {
            start: 0,
            score: 0,
            state: 'ready',
            priorScores: []
          }
        };
      });

      definePlugin()('ActionMap', function () {
        return {
          'space': [{target: controller().response, keypress: true}],
          'r': [{target: controller().reset, keypress: true}]
        };
      });

      definePlugin()('AcknowledgementMap', function () {
        return {
          'show-challenge': [{
            target: controller().challengeSeen
          }]
        };
      });
    };
  }
};