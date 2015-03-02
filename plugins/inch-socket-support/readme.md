[![npm version](https://badge.fury.io/js/inch-socket-support.svg)](http://badge.fury.io/js/inch-socket-support)
[![Build Status](https://travis-ci.org/distributedlife/inch-socket-support.svg?branch=master)](https://travis-ci.org/distributedlife/inch-socket-support)
[![Coverage Status](https://img.shields.io/coveralls/distributedlife/inch-socket-support.svg)](https://coveralls.io/r/distributedlife/inch-socket-support)

# inch-socket-support
Add socket.io support to your inch.js game. Socket.io is used to ship the game state between the server and the clients and to send input from the clients to the server. Most of the work is done for you.

# Usage
There are bunch of standard hooks for socket events. If you have run of the mill base for your game state and a standard input handler, you can use the supplied generator.

```javascript
var GameState = require('inch-game-state');
var state = new GameState();

var InputHandler = require('inch-input-handler');
var inputHandler = new InputHandler();

var SocketSupport = require('inch-socket-support');
var io = require('socket.io').listen(server);
var ackMap = {};
var callbacks = SocketSupport.createStandardCallbacksHash(state, inputHandler);
SocketSupport.setup(io, callbacks, ackMap, "arcade");
```

## Callbacks
Or, you can supply your own set of callbacks.

```javascript
var callbacks = {
	onPlayerConnect: function() {},
	onPlayerDisconnect: function() {},
	onObserverConnect: function() {},
	onObserverDisconnect: function() {},
	onPause: function() {},
	onUnpause: function() {},
	onNewUserInput: function() {},
	getGameState: function() { return state; }
};
```

The onEvents are used to notify you of when these events occur. If you don’t care then you can leave it blank and an empty function will be used in its place.

The `getGameState` function is used by this module when pushing updates to the client. As always, it’s your function so you can do what you want with it.

## Acknowledgement Map
The acknowledgement map is a way for the game logic code to be notified of when the client has received a specific event. Normally the acks from the client are recorded but are not propagated through the system.

```javascript
var acks = {
	'show-challenge': [player.challengeSeen]
};
```

In the case above we have the function `player.challengeSeen` being bound to the ‘show-challenge’ event. Some where on the client will be a line of code like: `acknowledge('show-challenge’);`. When the ack reaches the server the callback is invoked.

# Alternatives
- None as yet.
- Don’t have socket support. Life will go on without it. You will have to find a different way to tell the view that players have connected/disconnected and the game has paused/unpaused and how state and input are handled. You can do that if you want though.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.