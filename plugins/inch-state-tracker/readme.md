[![npm version](https://badge.fury.io/js/inch-state-tracker.svg)](http://badge.fury.io/js/inch-state-tracker)
[![Build Status](https://travis-ci.org/distributedlife/inch-state-tracker.svg?branch=master)](https://travis-ci.org/distributedlife/inch-state-tracker)
[![Coverage Status](https://img.shields.io/coveralls/distributedlife/inch-state-tracker.svg)](https://coveralls.io/r/distributedlife/inch-state-tracker)

# inch-state-tracker
The game state is sent from the server to the client frequently. This module is wired into the framework to provide support for dealing with state changes. All of the module works in a way where you register your intent and callbacks will be invoked with the current and prior state as well as any special data you'd like to pass through.

# Usage
This object gets wired into your level setup automatically. What follows here is how to use that wired in object.

When a property changes.
```javascript
// var state = {myProperty: "myValue"};
var the = require("inch-state-tracker").The;
var myFunc = function(currentValue, priorValue, data) {
	console.log(currentValue, priorValue, data);
};
Tracker.onChangeOf(the("myProperty"), myFunc, {extra: "data"})
```

When a property changes to a specific value.
```javascript
// var state = {myProperty: "myValue"};
var equals = require("inch-state-tracker").Equals;
var watching = function(state) { return state.myProperty; };
var myFunc = function(currentValue, priorValue, data) {
	console.log(currentValue, priorValue, data);
};
Tracker.onChangeOf(the("myProperty"), equals("myDesiredValue"), myFunc, {extra: "data"})
```

When a complex object changes:
```javascript
// var state = {myObj: {child: "value"}};
var the = require("inch-state-tracker").The;
var myFunc = function(currentValue, priorValue, data) {
	console.log(currentValue, priorValue, data);
};
Tracker.onChangeOf(the("myObj"), myFunc, {extra: "data"})
```

Dealing with arrays:
```javascript
// var state = {myArray: []};
var to = require("inch-state-tracker").To;
var from = require("inch-state-tracker").From;
var within = require("inch-state-tracker").Within;
var myFunc = function(currentValue, priorValue, data) {
	console.log(currentValue, priorValue, data);
};
Tracker.onElementAdded(to("myArray"), myFunc, {extra: "data"})
Tracker.onElementRemoved(from("myArray"), myFunc, {extra: "data"})
Tracker.onElementChanged(within("myArray"), myFunc, {extra: "data"})
```

When you have a complex value to compare:
```javascript
var myThingToWatch = function(state) { return state.myObject.myChild ; };
var myFunc = function(currentValue, priorValue, data) {
	console.log(currentValue, priorValue, data);
};
Tracker.onChangeOf(myThingToWatch, myFunc, {extra: "data"})
```

# Alternatives
There are none.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.