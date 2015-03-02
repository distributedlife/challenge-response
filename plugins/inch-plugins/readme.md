[![Build Status](https://travis-ci.org/distributedlife/inch-plugins.svg)](https://travis-ci.org/distributedlife/inch-plugins)
[![npm version](https://badge.fury.io/js/inch-plugins.svg)](http://badge.fury.io/js/inch-plugins)
[![Coverage Status](https://coveralls.io/repos/distributedlife/inch-plugins/badge.svg)](https://coveralls.io/r/distributedlife/inch-plugins)

# inch-plugins
Both the client and server components of the inch.js framework use a custom module loader. This is that module loader. The module loader is used so that isolated components can declare their dependencies without having explicit wiring. The game developer loads the modules they want to use in their manifests. This module passes in each dependency when required.

The idea is that inch-modules are designed around likelihood of interchangability. A game camera is a good place to start. All games need a camera, most use one of a handful. Select one and tell the plugin manager you want to do it. The game code that needs a camera can specify one as a dependency. It'll be delivered.

# Usage
## Load modules for use
```javascript
var PluginManager = require("inch-plugins").PluginManager;
PluginManager.load(require('inch-plugin-orthgraphic-camera'));
```

## Load simple value
```javascript
var PluginManager = require("inch-plugins").PluginManager;
PluginManager.set("MyValue", 42);
```

## To load an array
You load them the exact same way. The difference is in the how they are passed in as a dependency.

```javascript
var PluginManager = require("inch-plugins").PluginManager;
PluginManager.load(require('inch-plugin-one'));
PluginManager.load(require('inch-plugin-two'));
```

## To define your own module
There is a simple structure for declaring a npm-module as an inch-module. There are three aspects, the `type`, the `deps` and the `func` itself.

The `type` is used by other modules to find this module. It's a shitty class system where conventions define the interface rather than an strict interface definition. All modules of the same `type` should use the same interface. If they don't then an error will occur somewhere in the caller.

The `deps` is an array of strings. These are the `types` of other modules that this one requires. All dependencies are deferred. This means that the dependencies can be loaded in any order. Your module will receive a function that, when called, will deliver the dependency. A function is returned rather than the dep itself. This is so we can load the dependencies in any order.

Dependencies can be a single value or an array of values. Which is which is convention.

The `func` is your module code. It is executed upon loading and the return value is registered as the module-code.

```javascript
module.exports = {
  type: "Mine",
  deps: ["Dep"],
  func: function(Dep) {
    return {
      Mine: function() {
        return Dep().value + 1;
      }
    };
  }
};
```

## How to handle arrays as dependencies.
```javascript
module.exports = {
  type: "Mine",
  deps: ["Dep"],
  func: function(Dep) {
    return function () {
      var length = 0;

      _.each(Dep(), function(dep) { length += 1; });

      return length;
    };
  }
};
```

## Order of execution.
All dependencies are loaded as deferred dependencies. All `func` methods are executed and returned to the consumer. Anything in that scope is executed on load. You shouldn't use dependencies here. You should return a structure or a function that can be used by the consumer. Make use of the `deps` at that point.

> An error is raised if a module is used before being loaded.


# Current module names used within the framework
## Single Object
- Camera (single)
- ConnectDisconnectBehaviour (single)
- Debug (single)
- Dimensions (single)
- DisplayBehaviour (single)
- IconLayout (single)
- PositionHelper (single)
- RenderEngineAdapter (single)
- SocketBehaviour (single)
- UpdateLoop (single)

## Returns an array
- Font (array)
- InputMode (array)
- Level (array)

# The inch.js framework
This repository is just one part of the [icnh.js game framework](http://github.com/distributedlife/inch.js).