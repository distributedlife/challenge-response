"use strict";

var pluginManager = require('inch-plugins');
pluginManager.set('Window', require('window'));
pluginManager.set('GameMode', "8seconds");
pluginManager.set('AspectRatio', 26 / 10);
pluginManager.set('WidescreenMinimumMargin', 32);
pluginManager.set('Element', "canvas");
pluginManager.set('FOV', 60);
pluginManager.set('DebugProperties', {});
pluginManager.load(require('inch-plugin-dimensions-widescreen'));
pluginManager.load(require('inch-plugin-render-engine-adapter-threejs'));
pluginManager.load(require('inch-plugin-connect-disconnect-behaviour'));
pluginManager.load(require('inch-plugin-camera-orthographic-centred'));
pluginManager.load(require('inch-plugin-input-mode-keyboard'));
pluginManager.load(require("inch-plugin-position-helper-2d"));
pluginManager.load(require("inch-plugin-socket-behaviour-desktop"));
pluginManager.load(require("inch-plugin-display-behaviour-standard"));
pluginManager.load(require("inch-plugin-update-loop-vsync"));
pluginManager.load(require('inch-plugin-icon-layout-fixed-aspect'));
pluginManager.load(require("inch-plugin-debug-outside-in-grid"));
pluginManager.load(require("inch-plugin-level-player-observer-count"));
pluginManager.load(require('inch-plugin-level-standard-behaviour'));
pluginManager.load(require("./levels/default"));
// pluginManager.load(require("./levels/shared"));
pluginManager.load(require("./levels/8seconds"));

var clientSideEngine = require('inch-client-assembler')(pluginManager);
clientSideEngine.assembleAndRun();
