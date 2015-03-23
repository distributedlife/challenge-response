"use strict";

var plugins = require('./plugins/inch-plugins/src/plugin_manager.js').PluginManager;

plugins.loadPath(process.cwd() + "/game/js/modes");
plugins.loadPath(process.cwd() + '/game/js/entities');

var modes = {
  'practice': plugins.get("GameMode-Practice")
}

var inch = "./plugins/inch-plugin-server-express/src/js/server.js";
require(inch).Server("./game", modes).start(plugins);