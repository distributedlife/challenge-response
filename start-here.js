"use strict";

//TODO: Rather than define our modes, we could use the filename as the mode and autoload the folder. These could be loaded as modules. This becomes a one-liner and we move on with our lives. I think this solution would require plugins to be both named and typed. Names being optional of course and only needed when you want a specific implementation of a plugin rather than any old plugin.

var plugins = require('./plugins/inch-plugins/src/plugin_manager.js').PluginManager;

plugins.load(require("./game/js/modes/practice"));
plugins.load(require('./game/js/entities/controller'));

var modes = {
  'practice': plugins.get("GameMode")
}

var inch = "./plugins/inch-plugin-server-express/src/js/server.js";
require(inch).Server("./game", modes).start(plugins);