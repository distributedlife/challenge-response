"use strict";

var modes = {
    'practice': require("./game/js/modes/practice")
};

var overlays = {
    'practice': process.cwd() + "/game/jade/primary.jade"
};

var server = require("inch-express-server").Server("./game", modes, overlays);
server.start();