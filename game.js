"use strict";

var modes = {
  'practice': require("./game/js/modes/practice")
};

require("./plugins/inch-plugin-server-express/src/js/server.js").Server("./game", modes).start();