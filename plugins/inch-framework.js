'use strict';

var plugins = require('./inch-plugins/src/plugin_manager.js').PluginManager;

plugins.load(require('./inch-plugin-server-express/src/js/server.js'));
plugins.load(require('./inch-input-handler/src/input-handler.js'));
plugins.load(require('./inch-delayed-effects/src/manager.js'));
plugins.load(require('./inch-socket-support/src/socket-support.js'));
plugins.load(require('./inch-game-engine/src/engine.js'));
plugins.load(require('./inch-plugin-state-mutator-default/src/index.js'));
plugins.load(require('./inch-plugin-behaviour-invoker-default/src/index.js'));

module.exports = {
  loadPath: plugins.loadPath,
  get: plugins.get,
  run: function (pathToGame, modes) {
    plugins.get('Server').start(pathToGame, modes);

    var each = require('lodash').each;
    var definePlugin = plugins.get('DefinePlugin');

    //TODO: move each of these into a seperate file
    //inch/server/state-seed.js
    definePlugin('StateSeed', function () {
      return {
        inch: {
          players: 0,
          observers: 0,
          paused: false,
          started: Date.now()
        }
      };
    });
    //inch/server/event/on-pause.js
    definePlugin('OnPause', function () {
      return function () {
        return {
          inch: {
            paused: true
          }
        };
      };
    });
    definePlugin('OnUnpause', function () {
      return function () {
        return {
          inch: {
            paused: false
          }
        };
      };
    });
    definePlugin('OnPlayerConnected', ['StateAccess'], function (state) {
      return function () {
        return {
          inch: {
            players: state().get('players') + 1
          }
        };
      };
    });
    definePlugin('OnPlayerDisconnected', ['StateAccess'], function (state) {
      return function () {
        return {
          inch: {
            paused: true,
            players: state().get('players') - 1
          }
        };
      };
    });
    definePlugin('OnObserverConnected', ['StateAccess'], function (state) {
      return function () {
        return {
          inch: {
            observers: state().get('observers') + 1
          }
        };
      };
    });
    definePlugin('OnObserverDisconnected', ['StateAccess'], function (state) {
      return function () {
        return {
          inch: {
            observers: state().get('observers') - 1
          }
        };
      };
    });
    //inch/server/initialise-state.js
    definePlugin('InitialiseState', ['StateSeed', 'StateMutator'], function (stateSeed, stateMutator) {
      return function () {
        each(stateSeed(), function (state) {
          stateMutator()(state);
        });
      };
    });

    plugins.get('InitialiseState')();
    plugins.get('ServerSideEngine')().run(120);
  }
};