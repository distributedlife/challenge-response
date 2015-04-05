'use strict';

var loader = require('../../inch-entity-loader/src/loader.js');
var isArray = require('lodash').isArray;
var contains = require('lodash').contains;

//Multimode plugins are initialised to an empty array.
var plugins = {
  InputMode: [],
  Font: [],
  Level: [],
  OnPauseCallback: [],
  OnResumeCallback: [],
  OnMuteCallback: [],
  OnUnmuteCallback: [],
  ServerSideUpdate: [],
  StateSeed: [],
  OnPlayerConnect: [],
  OnPlayerDisconnect: [],
  OnObserverConnect: [],
  OnObserverDisconnect: [],
  OnPause: [],
  OnUnpause: [],
  OnInput: []
};

var deprecated = [
  'Debug', 'Camera', 'DebugProperties', 'Font', 'FOV', 'RenderEngineAdapter', 'PluginManager'
];

var get = function (name) {
  if (!plugins[name]) {
    throw new Error('No plugin defined for: ' + name);
  }

  if (contains(deprecated, name)) {
    console.log(name + ' is deprecated');
  }

  return plugins[name];
};

var load = function (module) {
  module.deps = module.deps || [];

  var args = [];
  var i;

  var deferredDependency = function (deferred) {
    return function () {
      return get(deferred);
    };
  };

  var dep;
  for (i = 0; i < module.deps.length; i += 1) {
    dep = module.deps[i];
    if (dep.indexOf('*') !== -1) {
      throw new Error('Dependency ' +  dep + ' for role ' + module.type + 'contains an asterisk. This is no longer used for deferred dependencies as all dependencies are now deferred.');
    }

    args.push(deferredDependency(dep));
  }

  if (isArray(plugins[module.type])) {
    plugins[module.type].push(module.func.apply(this, args));
  } else {
    plugins[module.type] = module.func.apply(this, args);
  }
};

var loadPath = function (path) {
  loader.loadFromPath(path, load);
};

var set = function (name, thing) {
  plugins[name] = thing;
};

var define = function (type, deps, func) {
  if (deps instanceof Function) {
    return {
      type: type,
      func: deps
    };
  } else {
    return {
      type: type,
      deps: deps,
      func: func
    };
  }
};

var pluginManager = {
  load: load,
  loadPath: loadPath,
  set: set,
  get: get
};

pluginManager.load({
  type: 'PluginManager',
  func: function() {
    return pluginManager;
  }
});

pluginManager.load({
  type: 'DefinePlugin',
  func: function () {
    return function (type, deps, func) {
      load(define(type, deps, func));
    };
  }
});

module.exports = {
  PluginManager: pluginManager
};