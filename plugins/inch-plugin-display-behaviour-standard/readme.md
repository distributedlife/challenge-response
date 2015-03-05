[![npm version](https://badge.fury.io/js/inch-standard-display-behaviour.svg)](http://badge.fury.io/js/inch-standard-display-behaviour)
[![Build Status](https://travis-ci.org/distributedlife/inch-plugin-display-behaviour-standard.svg?branch=master)](https://travis-ci.org/distributedlife/inch-plugin-display-behaviour-standard)
[![Coverage Status](https://img.shields.io/coveralls/distributedlife/inch-plugin-display-behaviour-standard.svg)](https://coveralls.io/r/distributedlife/inch-plugin-display-behaviour-standard?branch=master)

# inch-standard-display-behaviour
The display, which encompases the UI, the WebGL Canvas and what the visualisation of your game is all wrapped up in a greedily defined concept as display behaviour. This class does a few things which I list here:

- calls setup the camera (preference expressed in config)
- sets up the scene and renderer and wires them all together (delegates to a `inch-plugin-render-engine-adapter-*` to do this)
- handles pause/resume behaviour (greying out the screen, not sending updates)
- updates the player and observer counts (when included)
- calls the setup function on your level
- handles packet acknowledgement and updates the state sent by the server
- is called by the renderloop (preference expressed in config) and ensures all registered effects get 'tick'ed
- handles display resize.

This could be split up into smaller modules but that hasn't happened yet.

# Usage
Include it by loading it as a plugin. After that you don't need to do much as this handles it all.

```javascript
pluginManager.use(require('inch-standard-display-behaviour'));
```

# Alternatives
- Roll your own.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.