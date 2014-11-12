"use strict";

var THREE = require('inch-threejs');
var window = require('window');

//TODO: this another way
require("inch-font-helvetiker_regular")(THREE);

var configuration = {
	camera: require('inch-orthographic-camera')(THREE),
	controls: [
		require("inch-input-keyboard")
	],
	level: require("./levels/default")(THREE)
};

//require('inch-threejs-client-assembler');
var clientSideEngine = require('../../inch/public/js/inch-rendering-engine/assembler')(THREE, window, configuration);
clientSideEngine.run();