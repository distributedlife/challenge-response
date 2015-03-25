"use strict";

var inch = require('./plugins/inch-framework.js');
inch.loadPath(process.cwd() + "/game/js/modes");
inch.loadPath(process.cwd() + '/game/js/entities');

var modes = {
  'practice': inch.get("GameMode-Practice")
};

inch.run("./game", modes);