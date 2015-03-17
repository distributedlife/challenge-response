"use strict";

//TODO: Rather than define our modes, we could use the filename as the mode and autoload the folder. These could be loaded as modules. This becomes a one-liner and we move on with our lives.
var modes = {
  'practice': require("./game/js/modes/practice")
};

var inch = "./plugins/inch-plugin-server-express/src/js/server.js";
require(inch).Server("./game", modes).start();