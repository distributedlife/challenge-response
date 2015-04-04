'use strict';

var each = require('lodash').each;
var plugins = require('./inch-plugins/src/plugin_manager.js').PluginManager;

plugins.load(require('./inch-plugin-server-express/src/js/server.js'));
plugins.load(require('./inch-input-handler/src/input-handler.js'));
plugins.load(require('./inch-delayed-effects/src/manager.js'));
plugins.load(require('./inch-socket-support/src/socket-support.js'));
plugins.load(require('./inch-game-engine/src/engine.js'));
plugins.load(require('./inch-plugin-state-mutator-default/src/index.js'));
plugins.load(require('./inch-plugin-behaviour-invoker-default/src/index.js'));
plugins.load(require('./server/events/on-pause.js'));
plugins.load(require('./server/events/on-unpause.js'));
plugins.load(require('./server/events/on-player-connected.js'));
plugins.load(require('./server/events/on-player-disconnected.js'));
plugins.load(require('./server/events/on-observer-connected.js'));
plugins.load(require('./server/events/on-observer-disconnected.js'));
plugins.load(require('./server/state/initialiser.js'));
plugins.load(require('./server/state/seed.js'));

var run = function (pathToGame, modes) {
  plugins.get('Server').start(pathToGame, modes);

  plugins.get('InitialiseState').initialise();
  plugins.get('ServerSideEngine').run(120);
};

module.exports = {
  runGameAtPath: function (path) {
    plugins.loadPath(path + '/js/modes');
    plugins.loadPath(path + '/js/entities');

    var modes = require(path + '/js/modes.js');
    each(modes, function (pluginName, modeName) {
      modes[modeName] = plugins.get(pluginName);
    });

    run(path, modes);
  },
};