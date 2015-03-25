var plugins = require('./inch-plugins/src/plugin_manager.js').PluginManager;

plugins.load(require("./inch-plugin-server-express/src/js/server.js"));
plugins.load(require('./inch-input-handler/src/input-handler.js'));
plugins.load(require('./inch-delayed-effects/src/manager.js'));
plugins.load(require('./inch-socket-support/src/socket-support.js'));
plugins.load(require('./inch-game-engine/src/engine.js'));
plugins.load(require('./inch-plugin-state-mutator-default/src/index.js'));
plugins.load(require('./inch-plugin-behaviour-invoker-default/src/index.js'));

module.exports = {
  loadPath: plugins.loadPath,
  get: plugins.get,
  start: function (pathToGame, modes) {
    plugins.get("Server").Server(pathToGame, modes).start();

    var each = require('lodash').each;
    var definePlugin = plugins.get("DefinePlugin");
    definePlugin("StateSeed", function () {
      return {
        inch: {
          players: 0,
          observers: 0,
          paused: false,
          started: Date.now(),
          dimensions: { width: 1000, height: 500 }
        }
      };
    });
    definePlugin("OnPause", ["StateAccess"], function (State) {
      return function () {
        return {
          inch: {
            paused: true
          }
        };
      };
    });
    definePlugin("OnUnpause", ["StateAccess"], function (State) {
      return function () {
        return {
          inch: {
            paused: false
          }
        };
      };
    });
    definePlugin("OnPlayerConnected", ["StateAccess"], function (State) {
      return function () {
        return {
          inch: {
            players: State().get("players") + 1
          }
        };
      };
    });
    definePlugin("OnPlayerDisconnected", ["StateAccess"], function (State) {
      return function () {
        return {
          inch: {
            paused: true,
            players: State().get("players") - 1
          }
        };
      };
    });
    definePlugin("OnObserverConnected", ["StateAccess"], function (State) {
      return function () {
        return {
          inch: {
            observers: State().get("observers") + 1
          }
        };
      };
    });
    definePlugin("OnObserverDisconnected", ["StateAccess"], function (State) {
      return function () {
        return {
          inch: {
            observers: State().get("observers") - 1
          }
        };
      };
    });
    definePlugin("InitialiseState", ["StateSeed", "StateMutator"], function (StateSeed, StateMutator) {
      return function () {
        each(StateSeed(), function (state) {
          StateMutator()(state);
        });
      };
    });

    plugins.get("InitialiseState")();
    plugins.get("ServerSideEngine")().run(120);
  }
};