# inch-temporary-effect
A mixin or object for temporary objects. You can give it two call backs, both optional. The first is called each tick and passes in the delta-time and the progress. The second is called at the end of the objects life. There are no parameters here.

# Usage
You can use this module in one of two ways. As a mixin to give the behaviour to an existing object. Or, as a standalone object that you give a callback too.

A permanent effect can be achieved by setting the duration to 0.

- tick: call this once a tick passing in the delta
- isAlive: returns true if the object is older than it’s set duration. Always returns false if duration is zero.

The supplied onTick function stops being called after the object has died. You should remove this object once that has occurred.

## Mixin

```javascript
var TemporaryEffect = require('inch-temporary-effect');
var _ = require(‘lodash’);

var myThing = {
		onDeath: function() {
			console.log(‘Time has expired’);
		},
    	onTick: function(delta, progress) {
			console.log(“delta is”, dt);
			console.log(“progress (0.0 - 1.0):”, progress);
		}
 	}
};

_.extend(myThing, TemporaryEffect(
	duration,
	myThing.onTick.bind(myThing),
	myThing.onDeath.bind(myThing)
));

setTimeout(function() {
	myThing.tick(workOutWhatTheDeltaIs());
}, 1000 / 30);
```

## Standalone
```javascript
var TemporaryEffect = require('inch-temporary-effect');
var onTick = function(dt, progress) {
	console.log(“delta is”, dt);
	console.log(“progress (0.0 - 1.0):”, progress);
};
var onDeath = function() {
	console.log(‘ouch!’);
};

var t = Object.create(TemporaryEffect(5, onTick, onDeath));

setTimeout(function() {
	t.tick(workOutWhatTheDeltaIs());
}, 1000 / 30);

```

# Alternatives
The geometry packages that can be pulled in for the inch framework e.g. inch-geometry-* all make use of this module. You don’t have to use these functions if you don’t want to.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.