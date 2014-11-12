"use strict";

//TODO: this another way
var THREE = require('inch-threejs');
require("inch-font-helvetiker_regular")(THREE);

var configuration = {
	camera: require('inch-orthographic-camera')(THREE),
	controls: [
		require("../../inch/public/js/inch-rendering-engine/keyboard_controller")
	],
	level: require("./levels/default")(THREE)
};

//require('inch-threejs-client-assembler');	
var clientSideEngine = require('../../inch/public/js/inch-rendering-engine/assembler')(THREE, configuration);
clientSideEngine.run();