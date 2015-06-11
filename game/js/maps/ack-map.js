'use strict';

module.exports = {
  type: 'AcknowledgementMap',
  deps: ['GameBehaviour-Controller'],
  func: function (controller) {
    return ['*', {
      'show-challenge': [{
        target: controller().challengeSeen
      }]
    }];
  }
};