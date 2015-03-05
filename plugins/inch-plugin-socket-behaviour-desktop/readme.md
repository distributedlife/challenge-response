[![npm version](https://badge.fury.io/js/inch-plugin-socket-behaviour-desktop.svg)](http://badge.fury.io/js/inch-plugin-socket-behaviour-desktop)
[![Build Status](https://travis-ci.org/distributedlife/inch-plugin-socket-behaviour-desktop.svg)](https://travis-ci.org/distributedlife/inch-plugin-socket-behaviour-desktop)
[![Coverage Status](https://img.shields.io/coveralls/distributedlife/inch-plugin-socket-behaviour-desktop.svg)](https://coveralls.io/r/distributedlife/inch-plugin-socket-behaviour-desktop)

# inch-plugin-socket-behaviour-desktop
This module provides the behaviour for sending and receiving socket data to/from the server. The desktop flavour has support for input, for play/pause behaviour and for receiving the game state.

# Usage
```javascript
pluginManager.use(require('inch-plugin-socket-behaviour-desktop'))
```

# Dependencies
- Window: A standard browser window object
- ConnectDisconnectBehaviour: What to do when a socket connects or disconnects
- InputMode: The input modes to send thier state of their socket
- GameMode: A string used to identify your game mode. This is used to namespace the socket. A mode name could be "arcade" or "nightmare".

# Alternatives
These are in various stages of development:

- [inch-socket-behaviour-mobile](https://github.com/distributedlife/inch-socket-behaviour-mobile): support for playing the game on your mobile
- [inch-socket-behaviour-gamepad](https://github.com/distributedlife/inch-socket-behaviour-gamepad): support for playing the game on a browser with gamepad support.
- [inch-socket-behaviour-controller](https://github.com/distributedlife/inch-socket-behaviour-controller): support for using this browser instance as a controller only (works best on touch devices). No display support.
- [inch-socket-behaviour-observer](https://github.com/distributedlife/inch-socket-behaviour-observer): support putting the gameplay action on a big screen with no input support.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.