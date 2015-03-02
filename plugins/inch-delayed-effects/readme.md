# inch-delayed-effects
[![npm version](https://badge.fury.io/js/inch-delayed-effects.svg)](http://badge.fury.io/js/inch-delayed-effects)
[![Build Status](https://travis-ci.org/distributedlife/inch-delayed-effects.svg?branch=master)](https://travis-ci.org/distributedlife/inch-delayed-effects)
[![Coverage Status](https://img.shields.io/coveralls/distributedlife/inch-delayed-effects.svg)](https://coveralls.io/r/distributedlife/inch-delayed-effects)

Provides support for delayed effects within the constraints of the games timeline. A delayed effect is a function that is called after some time delay. This doesn’t use setTimeout as that’s based on world-time. This uses updates from the server loop and will be in sync with gameplay.

# Usage
```javascript
var delayedEffects = require(‘inch-delayed-effects’).DelayedEffects();
var key = "my-namespace";
var duration = 5;
var f = function() {
	console.log("Snappy comeback?");
};

var delayedEffects.add(key, duration, f);
var delayedEffects.update(5);
```

## Methods
- add: adds a new delayed effect. Takes a duration and function.
- update: put this into your update loop and smoke it.
- cancelAll: cancels all delayed effects.
- cancelAll(key): cancells all delayed effects with the same key.

# Alternatives
Do it yourself. Or, only have things happen now!

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.