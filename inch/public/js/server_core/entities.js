"use strict";

var normalizedPath = require('path').join(__dirname, "../../../../game/js/entities/");
var exports = {}

require("fs").readdirSync(normalizedPath).forEach(function(file){
	if (file === "index.js") {
		return;
	}
	if (file.indexOf(".js") < 0) {
		return;
	}

	var name = file.replace(".js", "");
	exports[name] = require(normalizedPath + file);
});

module.exports = exports;