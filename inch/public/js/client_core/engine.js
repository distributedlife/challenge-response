"use strict";

var stats = require("../framework/stats");
var window = require("window");

module.exports = function(update_display) {
  return {
    run: function(time) {
      stats( 'frame' ).start();
      stats( 'rAF' ).tick();
      stats( 'FPS' ).frame();

      update_display();

      stats( 'frame' ).end();
      stats().update();

      window.requestAnimationFrame(this.run.bind(this));
    }
  };
};