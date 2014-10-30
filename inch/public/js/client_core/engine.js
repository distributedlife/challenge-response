define(["vendor/window", "framework/stats"], function(window, stats) {
  "use strict";

  return function(display) {
    return {
      resize: function(dims) { display.resize(dims); },
      run: function(time) {
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
