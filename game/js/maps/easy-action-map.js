'use strict';

module.exports = {
  type: 'ActionMap',
  deps: ['GameBehaviour-Controller'],
  func: function (controller) {
    return ['easy', {
      'space': [{target: controller().response, onRelease: true}],
      'r': [{target: controller().reset, onRelease: true}]
    }];
  }
};