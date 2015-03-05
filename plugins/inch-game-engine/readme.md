# inch-game-engine
The game engine. One you kick this off it’ll run forever. When it runs it calls update on all the functions you’ve passed to it. You can also pass in a function that when it returns true the engine will pause.

A paused engine will not call update until unpaused.

# Usage
```javascript
var paused = function() { return false; };
var update = function(delta) { console.log(delta); } ;
var frequency = 120;
var Engine = require(‘inch-game-engine’);
var engine = new Engine(paused, update);
engine.run(frequency);
```

Frequency is how many times per second the engine will step. This is done through a setTimeout.

You don’t need to new the engine, you can also do:

```javascript
var engine = require(‘inch-game-engine’)(paused, update);
engine.run(frequency);
```

The update function can be an array of functions. All will be called and the delta passed into each of them.

```javascript
var paused = function() { return false; };
var update = [
	function(delta) { console.log(“herp”); },
	function(delta) { console.log(“derp”); }
];
var frequency = 120;
var Engine = require(‘inch-game-engine’);
var engine = new Engine(paused, update);
engine.run(frequency);
```

The standard approach is to pass in three important functions to the update loop and to use the *inch-game-state* isPaused function.

```javascript
var state = require(‘inch-game-state’).asIs();
var myGameLogic = require(‘my-awesome-behaviour’);
var input = require(‘inch-input-handler’);
var Engine = require(‘inch-game-engine’);

var engine = new Engine(
	state.isPaused.bind(state), 
	[
		state.update.bind(state), 
		logic.update, 
		input.update
	]
);
engine.run(frequency);
```

# Alternatives
If you don't want to use this then you don't have to use it. You could write your own game loop if you wanted to. 

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.

## Separate the game-loop and render-loop
A separation of the game loop and the render loop. The idea is that the render loop should be a representation of your game state and the code should be separate. Because of this you'll find no `.on('draw', function() {})` event handlers. On entities there is no `entity.draw` function for you to overload. The entity goes about it's merry way. In the renderer you can do things like this: 

```javascript
myGraphicalRepresentation.updateFromModel(readOnlyState).
```

## No explicit wiring
No explicit wiring between modules. The *inch-game-state* module has an property that contains the duration. There is also an update function that increases the duration by the time-delta. One could pass the game_state into the engine and the engine could call `game_state.update(delta)`. This is not what I want. 

The engine shouldn't care about the game state. The short of it is that it doesn't. It takes an array of update functions, like so: `new engine([game_state.update.bind(game_state), someOtherFunction.update])`. When the engine goes through it's loop it call *all the update* functions. Bam! Our game state duration gets updated and nobody has to know anything about anyone else. 

We'll you do, but that's why we are here.