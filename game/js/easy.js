'use strict';

var define = require('../../plugins/inch-define-plugin/src/define.js');

var pluginManager = require('../../plugins/inch-plugins/src/plugin_manager.js').PluginManager;
pluginManager.set('ServerUrl', 'http://localhost:3000/');
pluginManager.set('Window', require('window'));
pluginManager.set('GameMode', 'easy');
pluginManager.set('AspectRatio', 26 / 10);									//default, required
pluginManager.set('WidescreenMinimumMargin', 32);							//default, required
pluginManager.set('Element', 'canvas');                   //default, required
pluginManager.set('InputElement', 'input');                   //default, required
pluginManager.set('FOV', 60);												//default, required
pluginManager.set('DebugProperties', {});									//default, required

pluginManager.load(require('../../plugins/inch-plugin-dimensions-widescreen/src/dimensions.js'));			//default, required
pluginManager.load(require('../../plugins/inch-plugin-position-helper-2d/src/helper.js'));
pluginManager.load(require('../../plugins/inch-plugin-display-behaviour-standard/src/display.js'));


pluginManager.load(require('../../plugins/inch-plugin-connect-disconnect-behaviour/src/behaviour.js'));	//default, required
pluginManager.load(require('../../plugins/inch-plugin-socket-behaviour-desktop/src/behaviour.js'));

pluginManager.load(require('../../plugins/inch-state-tracker/src/tracker.js'));
pluginManager.load(require('../../plugins/inch-state-tracker/src/helper.js'));

pluginManager.load(require('../../plugins/inch-plugin-input-mode-keyboard/src/input.js'));

pluginManager.load(require('../../plugins/inch-plugin-update-loop-vsync/src/loop.js'));				//default, required

pluginManager.load(require('../../plugins/inch-plugin-icon-layout-fixed-aspect/src/layout-icons.js'));		//default, required
pluginManager.load(require('../../plugins/inch-plugin-level-player-observer-count/src/level.js'));
pluginManager.load(require('../../plugins/inch-plugin-level-standard-behaviour/src/level.js'));
pluginManager.load(require('./levels/default'));


// render engine dependent?
pluginManager.load(require('../../three-js-dep/inch-plugin-render-engine-adapter-threejs/src/adapter.js'));
pluginManager.load(require('../../supporting-libs/inch-plugin-debug-outside-in-grid/src/grid.js'));
pluginManager.load(require('../../three-js-dep/inch-plugin-camera-orthographic-centred/src/camera.js'));


var Howler = require('howler').Howler;
pluginManager.load(define('OnMuteCallback', function() {
  return function () {
    Howler.mute();
  };
}));

pluginManager.load(define('OnUnmuteCallback', function() {
  return function () {
    Howler.unmute();
  };
}));

var clientSideEngine = require('../../plugins/inch-client-assembler/src/assembler.js')(pluginManager);
clientSideEngine.assembleAndRun();