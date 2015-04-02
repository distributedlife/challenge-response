'use strict';

var screenfull = require('screenfull');
var $ = require('zepto-browserify').$;

module.exports = function () {
  $('.fullscreen').on('click', function () {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  });
};