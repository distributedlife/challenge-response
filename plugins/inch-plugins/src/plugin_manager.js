"use strict";

var _ = require('lodash');

//Multimode plugins are initialised to an empty array.
var plugins = {
    InputMode: [],
    Font: [],
    Level: []
};

var pluginManager = {
    load: function (module) {
        module.deps = module.deps || [];

        var args = [];
        var i;

        var deferredDependency = function (deferred) {
            return function () {
                return this.get(deferred);
            }.bind(this);
        }.bind(this);

        var dep;
        for (i = 0; i < module.deps.length; i += 1) {
            dep = module.deps[i];
            if (dep.indexOf("*") !== -1) {
                throw new Error("Dependency contains an asterisk. This is no longer used for deferred dependencies as all dependencies are now deferred.");
            }

            args.push(deferredDependency(dep));
        }

        if (_.isArray(plugins[module.type])) {
            plugins[module.type].push(module.func.apply(this, args));
        } else {
            plugins[module.type] = module.func.apply(this, args);
        }
    },
    get: function (name) {
        if (!plugins[name]) {
            throw new Error("No plugin defined for: " + name);
        }

        return plugins[name];
    },
    set: function (name, thing) {
        plugins[name] = thing;
    }
};

pluginManager.load({
    type: "PluginManager",
    func: function() {
        return pluginManager;
    }
});

module.exports = {
    PluginManager: pluginManager
};