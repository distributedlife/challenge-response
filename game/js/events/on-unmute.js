'use strict';

var Howler = require('howler').Howler;

module.exports = {
  type: 'OnUnmuteCallback',
  func: function () {
    return function () {
      Howler.unmute();
    };
  }
};
