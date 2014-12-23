"use strict";

var pluginManager = require('inch-plugins');
pluginManager.set('Window', require('window'));
pluginManager.set('GameMode', 'practice');
pluginManager.set('AspectRatio', 26 / 10);									//default, required
pluginManager.set('WidescreenMinimumMargin', 32);							//default, required
pluginManager.set('Element', "canvas");										//default, required
pluginManager.set('FOV', 60);												//default, required
pluginManager.set('DebugProperties', {});									//default, required
pluginManager.load(require('inch-plugin-dimensions-widescreen'));			//default, required
pluginManager.load(require('inch-plugin-render-engine-adapter-threejs'));
pluginManager.load(require('inch-plugin-connect-disconnect-behaviour'));	//default, required
pluginManager.load(require('inch-plugin-camera-orthographic-centred'));
pluginManager.load(require('inch-plugin-input-mode-keyboard'));
pluginManager.load(require("inch-plugin-debug-outside-in-grid"));
pluginManager.load(require("inch-plugin-position-helper-2d"));
pluginManager.load(require("inch-plugin-socket-behaviour-desktop"));
pluginManager.load(require("inch-plugin-display-behaviour-standard"));
pluginManager.load(require("inch-plugin-update-loop-vsync"));				//default, required
pluginManager.load(require('inch-plugin-icon-layout-fixed-aspect'));		//default, required
pluginManager.load(require("inch-plugin-level-player-observer-count"));
pluginManager.load(require('inch-plugin-level-standard-behaviour'));
pluginManager.load(require("./levels/default"));

var clientSideEngine = require('inch-client-assembler')(pluginManager);
clientSideEngine.assembleAndRun();
