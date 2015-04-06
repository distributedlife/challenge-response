'use strict';

var Howler = require('howler').Howler;

module.exports = {
  type: 'OnMuteCallback',
  func: function () {
    return function () {
      Howler.mute();
    };
  }
};