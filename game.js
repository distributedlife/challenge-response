"use strict";

var modes = {
    'practice': require("./game/js/modes/practice")
};

var overlays = {
	'practice': process.cwd() + "/game/jade/primary.jade"
}

var routes = require('inch-routes-standard');
var server = require("inch-express-server").Server("./game", routes(modes, overlays));
server.start();