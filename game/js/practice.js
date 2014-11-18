"use strict";

var configuration = function(THREE) {
	require("inch-font-helvetiker_regular")(THREE);

	return {
		controls: [
			require("inch-input-keyboard")
		],
		level: require("./levels/default")(THREE),
		debug: [require("inch-debug-outside-in-grid")(THREE, 75)]
	};
};

var pluginManager = require('inch-plugins');
pluginManager.use(require('inch-plugin-render-engine-adapter-threejs'));
pluginManager.set('Window', window);
pluginManager.use(require('inch-plugin-camera-orthographic'));
var clientSideEngine = require('inch-threejs-client-assembler')(pluginManager, configuration);
clientSideEngine.run();