[![npm version](https://badge.fury.io/js/inch-game-state.svg)](http://badge.fury.io/js/inch-game-state)
[![Build Status](https://travis-ci.org/distributedlife/inch-game-state.svg?branch=master)](https://travis-ci.org/distributedlife/inch-game-state)
[![Coverage Status](https://img.shields.io/coveralls/distributedlife/inch-game-state.svg)](https://coveralls.io/r/distributedlife/inch-game-state)

# inch-game-state
Contains the basic inch framework game state ready for you to extend it with your own juicy state.

- players - the number of players connected.
- observers - the number of devices watching the game.
- paused - is the game paused; starts true
- started - time the game started (server time)
- dimensions - game world dimensions; not to be confused with screen dimensions. You use this if you want to map a game with a fix board size (tetris, space invaders, etc) to a dynamic screen size
- wireframes - stores wireframes in debug modes

# Usage
```javascript
var GameState = require('inch-game-state');
var state = new GameState({
	player: { health: 50 }
});
```

The standard approach is to pass the isPaused function into the inch-game-engine. Like so:

```javascript
var GameState = require(‘inch-game-state’);
var state = new GameState();
var Engine = require(‘inch-game-engine’);
var gameEngine = new Engine(
	state.isPaused,
	[otherThing.update]
)
```

The game state also comes with helper functions for tracking the number of players and observers as well as pausing the game automatically when a player disconnects. These functions work well when passed into the [inch-socket-support](https://github.com/distributedlife/inch-socket-support) library as callbacks for player and observer disconnections.

The functions are:
- playerConnected
- playerDisconnected
- observerConnected
- observerDisconnected
- pause
- unpause

# Alternatives
- None as yet.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.
