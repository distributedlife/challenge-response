"use strict";

var modes = {
    'practice': require("./game/js/modes/practice")
};

var routes = require('inch-routes-standard');
var server = require("inch-express-server").Server("./game", routes(modes));
server.start();