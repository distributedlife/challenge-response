'use strict';

var Howler = require('howler').Howler;

module.exports = {
  type: 'OnUnmute',
  func: function () {
    return function () {
      Howler.unmute();
    };
  }
};
