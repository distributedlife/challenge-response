"use strict";

var modes = {
    'practice': require("./game/js/modes/practice")
};

var Routes = require('./inch-default-routes-no-auth');
var server = require("./inch-express-server").Server("./game", Routes(modes));
server.start();