'use strict';

module.exports = {
  type: 'ActionMap',
  deps: ['GameBehaviour-Controller'],
  func: function (controller) {
    return ['hard', {
      'i': [{call: controller().response, onRelease: true}],
      'r': [{call: controller().reset, onRelease: true}]
    }];
  }
};