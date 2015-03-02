"use strict";

var rek = require('rekuire');

var modes = {
	'8seconds': require("./game/js/modes/8seconds"),
  'practice': require("./game/js/modes/practice")
};

rek("plugins/inch-plugin-server-express").Server("./game", modes).start();