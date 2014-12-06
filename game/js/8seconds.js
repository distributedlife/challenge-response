"use strict";

var pluginManager = require('inch-plugins');
pluginManager.set('Window', require('window'));
pluginManager.load(require('inch-plugin-render-engine-adapter-threejs'));
pluginManager.load(require('inch-plugin-camera-orthographic-centred'));
pluginManager.load(require('inch-plugin-input-mode-keyboard'));
pluginManager.load(require("inch-plugin-debug-outside-in-grid"));
pluginManager.load(require("inch-plugin-position-helper-2d"));
pluginManager.load(require("./levels/default"));

var clientSideEngine = require('inch-client-assembler')(pluginManager);
clientSideEngine.assembleAndRun();