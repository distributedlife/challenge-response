"use strict";

var configuration = function(THREE) {
	require("inch-font-helvetiker_regular")(THREE);

	return {
		level: require("./levels/default")(THREE),
		debug: [require("inch-debug-outside-in-grid")(THREE, 75)]
	};
};

var pluginManager = require('inch-plugins');
pluginManager.use(require('inch-plugin-render-engine-adapter-threejs'));
pluginManager.set('Window', require('window'));
pluginManager.use(require('inch-plugin-camera-orthographic-centred'));
pluginManager.use(require('inch-plugin-input-mode-keyboard'));

var clientSideEngine = require('inch-client-assembler')(pluginManager, configuration);
clientSideEngine.run();