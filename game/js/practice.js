"use strict";

var pluginManager = require('inch-plugins');
pluginManager.set('Window', require('window'));
pluginManager.set('GameMode', 'practice');
pluginManager.load(require('inch-plugin-render-engine-adapter-threejs'));
pluginManager.load(require('inch-plugin-camera-orthographic-centred'));
pluginManager.load(require('inch-plugin-input-mode-keyboard'));
pluginManager.load(require("inch-plugin-debug-outside-in-grid"));
pluginManager.load(require("inch-plugin-position-helper-2d"));
pluginManager.load(require("inch-plugin-socket-behaviour-desktop"));
pluginManager.load(require("inch-plugin-display-behaviour-standard"));
pluginManager.load(require("inch-plugin-level-player-observer-count"));
pluginManager.load(require("./levels/default"));

var clientSideEngine = require('inch-client-assembler')(pluginManager);
clientSideEngine.assembleAndRun();


// var pluginManager = require('inch-plugins');
// pluginManager.loadFromConfig("/path/to/clientAssemblyConfig.json", "practice");
// var clientSideEngine = require('inch-client-assembler')(pluginManager);
// clientSideEngine.assembleAndRun();