"use strict";

//TODO: this another way
var THREE = require('inch-threejs');
require("../../inch/public/js/font/helvetiker_regular");

var configuration = {
	camera: require('inch-orthographic-camera')(THREE),
	display_config: {
		controls: ['keyboard', 'gamepad']
	},
	setup: require("./levels/default")(THREE)
};

//require('inch-client-engine');	
var clientSideEngine = require('../../inch/public/js/inch-rendering-engine/assembler')(configuration);
clientSideEngine.run();