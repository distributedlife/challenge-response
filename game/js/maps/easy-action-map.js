'use strict';

module.exports = {
  type: 'ActionMap',
  deps: ['GameBehaviour-Controller'],
  func: function (controller) {
    return ['easy', {
      'space': [{call: controller().response, onRelease: true}],
      'r': [{call: controller().reset, onRelease: true}]
    }];
  }
};