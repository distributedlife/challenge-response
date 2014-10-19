define(["vendor/window", "framework/stats"], function(window, stats) {
  "use strict";

  return function(display, width, height) {
    return {
      resize: function(width, height) {
        display.resize(width, height);
      },
      run: function() {
        stats( 'frame' ).start();
        stats( 'rAF' ).tick();
        stats( 'FPS' ).frame();

        display.update_display();

        stats( 'frame' ).end();
        stats().update();

        window.requestAnimationFrame(this.run.bind(this));
      }
    };
  };
});
