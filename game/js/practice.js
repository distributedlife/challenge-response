"use strict";

//TODO: this another way
var THREE = require('inch-threejs');
require("inch-font-helvetiker_regular")(THREE);

var configuration = {
	camera: require('inch-orthographic-camera')(THREE),
	display_config: {
		controls: ['keyboard', 'gamepad']
	},
	level: require("./levels/default")(THREE)
};

//require('inch-client-engine');	
var clientSideEngine = require('../../inch/public/js/inch-rendering-engine/assembler')(THREE, configuration);
clientSideEngine.run();