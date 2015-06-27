'use strict';

module.exports = {
  type: 'ActionMap',
  deps: ['GameBehaviour-Controller'],
  func: function (controller) {
    return ['hard', {
      'i': [{target: controller().response, onRelease: true}],
      'r': [{target: controller().reset, onRelease: true}]
    }];
  }
};