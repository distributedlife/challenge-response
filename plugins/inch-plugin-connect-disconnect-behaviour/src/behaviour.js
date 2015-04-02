'use strict';

module.exports = {
  type: 'ConnectDisconnectBehaviour',
  func: function () {
    var $ = require('zepto-browserify').$;

    return {
      disconnected: function () {
        $('.disconnected').show();
      },
      connected: function () {
        $('.disconnected').hide();
      }
    };
  }
};