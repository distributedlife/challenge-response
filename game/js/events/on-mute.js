'use strict';

var Howler = require('howler').Howler;

module.exports = {
  type: 'OnMute',
  func: function () {
    return function () {
      Howler.mute();
    };
  }
};