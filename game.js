"use strict";

var modes = {
	'8seconds': require("./game/js/modes/8seconds"),
    'practice': require("./game/js/modes/practice")
};

var overlays = {
    '8seconds': process.cwd() + "/game/jade/8seconds.jade",
    'practice': process.cwd() + "/game/jade/practice.jade"
};

var server = require("inch-server-express").Server("./game", modes, overlays);
server.start();