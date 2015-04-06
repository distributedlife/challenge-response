'use strict';

var plugins = require('../inch-plugins/src/plugin_manager.js').PluginManager;

module.exports = {
  plugins: plugins,
  load: plugins.load,
  loadDefaults: function () {
    plugins.set('ServerUrl', 'http://localhost:3000/');
    plugins.set('GameMode', 'easy');
    plugins.set('AspectRatio', 26 / 10);
    plugins.set('WidescreenMinimumMargin', 32);
    plugins.set('Element', 'canvas');
    plugins.set('InputElement', 'input');
    plugins.set('FOV', 60);
    plugins.set('DebugProperties', {});

    plugins.load(require('../inch-plugin-dimensions-widescreen/src/dimensions.js'));
    plugins.load(require('../inch-plugin-display-behaviour-standard/src/display.js'));
    plugins.load(require('../client/events/on-connect.js'));
    plugins.load(require('../client/events/on-disconnect.js'));
    plugins.load(require('../inch-plugin-socket-behaviour-desktop/src/behaviour.js'));
    plugins.load(require('../inch-state-tracker/src/tracker.js'));
    plugins.load(require('../inch-state-tracker/src/helper.js'));
    plugins.load(require('../inch-plugin-input-mode-keyboard/src/input.js'));
    plugins.load(require('../inch-plugin-update-loop-vsync/src/loop.js'));

    //../client/view-logic/icon-layout.js
    //../client/view-logic/observer-count.js
    //../client/view-logic/player-count.js
    plugins.load(require('../inch-plugin-icon-layout-fixed-aspect/src/layout-icons.js'));
    plugins.load(require('../inch-plugin-level-player-observer-count/src/level.js'));
    plugins.load(require('../inch-plugin-level-standard-behaviour/src/level.js'));
  }
};