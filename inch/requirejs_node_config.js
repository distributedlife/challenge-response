module.exports = function(requirejs) {
  requirejs.config({
    baseUrl: __dirname + '/client/javascript',
    nodeRequire: require,
    paths: {
      "socket.io": "/socket.io/socket.io",
      underscore: "npm/underscore-min",
      events: "npm/events",
      bacon: "npm/bacon",
      zepto: "vendor/zepto.min",
      jquery: "vendor/zepto.min",
      lodash: "vendor/lodash.min"
    },
    shim: {
      zepto: {
        init: function() {
          "use strict";
          return this.$;
        }
      },
      underscore: {
        exports: "_"
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