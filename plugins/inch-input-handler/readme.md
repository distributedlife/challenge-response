[![npm version](https://badge.fury.io/js/inch-input-handler.svg)](http://badge.fury.io/js/inch-input-handler)
[![Build Status](https://travis-ci.org/distributedlife/inch-input-handler.svg)](https://travis-ci.org/distributedlife/inch-input-handler)
[![Coverage Status](https://img.shields.io/coveralls/distributedlife/inch-input-handler.svg)](https://coveralls.io/r/distributedlife/inch-input-handler)

# inch-input-handler
A loosely coupled input handler for the inch game framework. It handles keyboard (both keypresses and key up/down modes), mouse, touch events, a virtual controller.

Gamepad and leapmotion support coming in the future.

It’s loosely coupled because you define an action map that specifies what input we care about and what function to call when we are done. It has a function so you can tell it when new input is received and there is an update function that can be passed into the main loop.

# Usage
The first step is to define an action map of what functions you want called when an input event is received.

The following action map says that when the *space* is received we should called the `jump` function on the player object. In this case we want a keypress event, not just a keydown event. A keydown is useful for continuous actions like movement. A keypress is useful for discrete actions like jump or use. You can ask for a keydown event by not including the `keypress: true` part of the config.

```javascript
var player = {
	jump: function() {
		console.log("I like to jump in puddles.");
  };
};

var actionMap = {
	'space': [{
		target: player.jump
		keypress: true,
		noEventKey: ‘player’
	}]
};
```

You will note that the `space` attribute is an array. This allows you to bind multiple callbacks to the same input event.

There are two methods on our input handler. The first is `newUserInput` which is called when user input is received from the player (somehow —possibly via the inch-socket-routes). The input is pushed on to a queue to be processed.

The second method is `update`. When this is called next hash of user input in the queue is processed. It’s a good idea to pass the update function into the game loop.

The `noEventKey` is only needed if you want to fire an event when an entity receives no input **at all** during the update call. Tag all related entities with a key and if none of those callbacks are called then the ‘nothing’ event with the same key is invoked.

Cursor events don’t count towards the noEventKey as they always fire.

# Action Map
The follow things can be specified in an action map.

- cursor, receives the location of the mouse cursor each time it changes
- keys, any keyboard character can be received as a continuous action (e.g. player is holding down the left-arrow) or as a single press (e.g. the player presses space).
- mouseN, where N is the mouse button number (button1, button2). These haven’t been consistently mapped to left-click, right-click, etc.
- touchN, where N is the touch event number (1st touch, 2nd touch, etc). The touch x and y values are sent. Touch events come with a force value (currently webkit only, otherwise 1) ranging from 0 to 1.
- left_stick, right_stick of virtual controller (and when I get back to oz: physical gamepad). Supplies the direction in the form of a vector and a force value indicating how hard the stick is being pushed.
- nothing, receives an event if the entity receives no events

```javascript
var thing = {
	cursor: function(cx, cy, data) {
		console.log("mouse-x", cx, "mouse-y", cy);
	},
	nothing: function(data) {
		console.log("no input for me today");
	},
	jump: function(force, data) {
	},
	show_popup: function(x, y, data) {
		console.log("I have nothing to say", x, y);
	},
	hey: function(x, y, force, data) {
		console.log("They got me here:", x ,y);
	},
	move: function(x, y, force, data) {
		console.log("I’m moving in the direction of", x, y);
	}
};

var actionMap = {
	‘cursor’: [{target: thing.cursor}],
	‘nothing’: [{target: thing.nothing}],
	‘space’: [{target: thing.jump}],
	‘mouse1’: [{target: thing.show_popup}],
	‘touch1’: [{target: thing.hey}],
	‘left_stick’: [{target: thing.move}]
};
```

All events receive a data notification. At the moment this is limited to the received timestamp.

# New Input
The new input function expects to things to be passed into it when it is called

```javascript
newUserInput: function(rawData, timestamp);
```

The timestamp is when the input occurred. This is in server time.

The rawData takes the following form:

```javascript
rawData = {
	keys: [‘a’, ‘escape’],
	singlePressKeys: [‘space’],
	x: 0,
	y: 0,
	touches: [{
		id: 0,
		x: 0,
		y: 0,
		force: 1.0
	}]
};
````

# Alternatives
Handle your own input.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.