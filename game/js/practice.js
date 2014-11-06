"use strict";

//TODO: this another way
require("../../inch/public/js/font/helvetiker_regular");

var configuration = {
	camera: require('inch-orthographic-camera'),
	display_config: {
		controls: ['keyboard', 'gamepad']
	},
	setup: require("./levels/default")
};

//require('inch-client-engine');	
var clientSideEngine = require('../../inch/public/js/inch-rendering-engine/assembler')(configuration);
clientSideEngine.run();