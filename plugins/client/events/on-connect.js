'use strict';

module.exports = {
  type: 'OnConnect',
  func: function () {
    var $ = require('zepto-browserify').$;

    return function () {
      $('.disconnected').hide();
    };
  }
};