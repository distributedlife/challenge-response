'use strict';

module.exports = {
  type: 'OnDisconnect',
  func: function () {
    var $ = require('zepto-browserify').$;

    return function () {
      $('.disconnected').show();
    };
  }
};