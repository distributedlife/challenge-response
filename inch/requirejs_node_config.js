module.exports = function(requirejs) {
  requirejs.config({
    baseUrl: __dirname + '/client/javascript',
    nodeRequire: require,
    paths: {
      "socket.io": "/socket.io/socket.io",
      events: "npm/events",
      zepto: "vendor/zepto.min",
      lodash: "vendor/lodash.min"
    },
    shim: {
      zepto: {
        init: function() {
          "use strict";
          return this.$;
        }
      },
      'vendor/gamepad': {
        init: function() {
          "use strict";
          return this.Gamepad;
        }
      },
      'vendor/three': {
        init: function() {
          "use strict";
          return this.THREE;
        }
      },
      'vendor/websocket': {
        init: function() {
          "use strict";
          return this.WebSocket;
        }
      },
      'vendor/window': {
        init: function() {
          "use strict";
          return this.window;
        }
      },
      'vendor/soundmanager2-nodebug-jsmin': {
        deps: ['vendor/window'],
        init: function() {
          "use strict";
          return this.SoundManager;
        }
      }
    }
  });
};