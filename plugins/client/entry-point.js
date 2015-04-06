'use strict';

var plugins = require('../inch-plugins/src/plugin_manager').PluginManager;

module.exports = {
  load: plugins.load,
  loadWindow: function (window) {
    plugins.set('Window', window);
  },
  run: function () {
    plugins.get('ClientSideAssembler').assembleAndRun();
  },
  loadDefaults: function () {
    plugins.set('ServerUrl', 'http://localhost:3000/');
    plugins.set('GameMode', 'easy');
    plugins.set('AspectRatio', 26 / 10);
    plugins.set('WidescreenMinimumMargin', 32);
    plugins.set('Element', 'canvas');
    plugins.set('InputElement', 'input');
    plugins.set('FOV', 60);
    plugins.set('DebugProperties', {});

    plugins.load(require('../inch-plugin-dimensions-widescreen/src/dimensions'));
    plugins.load(require('../inch-plugin-display-behaviour-standard/src/display'));
    plugins.load(require('../client/events/on-connect'));
    plugins.load(require('../client/events/on-disconnect'));
    plugins.load(require('../inch-plugin-socket-behaviour-desktop/src/behaviour'));
    plugins.load(require('../inch-state-tracker/src/tracker'));
    plugins.load(require('../inch-state-tracker/src/helper'));
    plugins.load(require('../inch-plugin-input-mode-keyboard/src/input'));
    plugins.load(require('../inch-plugin-update-loop-vsync/src/loop'));

    //../client/view-logic/icon-layout
    //../client/view-logic/observer-count
    //../client/view-logic/player-count
    plugins.load(require('../inch-plugin-icon-layout-fixed-aspect/src/layout-icons'));
    plugins.load(require('../inch-plugin-level-player-observer-count/src/level'));
    plugins.load(require('../inch-plugin-level-standard-behaviour/src/level'));

    plugins.load(require('../inch-client-assembler/src/assembler'));
  }
};