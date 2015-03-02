[![Build Status](https://travis-ci.org/distributedlife/inch-define-plugin.svg)](https://travis-ci.org/distributedlife/inch-define-plugin)
[![npm version](https://badge.fury.io/js/inch-define-plugin.svg)](http://badge.fury.io/js/inch-define-plugin)
[![Coverage Status](https://coveralls.io/repos/distributedlife/inch-define-plugin/badge.svg)](https://coveralls.io/r/distributedlife/inch-define-plugin)

# inch-define-plugin
A simple module (that isn't a plugin module) that makes it easier for you to write the boilerplate required.

# Usage
```javascript
var define = require('inch-define-plugin');
pluginManager.load(define("MyPlugin", ["DepedencyA", "DependencyB"], function (a, b) { return 42; }));
```

Or, without deps
```javascript
var define = require('inch-define-plugin');
pluginManager.load(define("MyPlugin", function () { return 42; }));
```

# The inch.js framework
This repository is just one part of the [icnh.js game framework](http://github.com/distributedlife/inch.js).