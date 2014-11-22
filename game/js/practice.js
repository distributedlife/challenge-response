"use strict";

var pluginManager = require('inch-plugins');
pluginManager.set('Window', require('window'));
pluginManager.load(require('inch-plugin-render-engine-adapter-threejs'));
pluginManager.load(require('inch-plugin-camera-orthographic-centred'));
pluginManager.load(require('inch-plugin-input-mode-keyboard'));
pluginManager.load(require("inch-font-helvetiker_regular"));
pluginManager.load(require("inch-plugin-debug-outside-in-grid"));

var clientSideEngine = require('inch-client-assembler')(pluginManager);
clientSideEngine.addLevel(require("./levels/default")(pluginManager.get('RenderEngineAdapter')));
clientSideEngine.assembleAndRun();