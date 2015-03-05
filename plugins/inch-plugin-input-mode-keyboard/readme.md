[![npm version](https://badge.fury.io/js/inch-plugin-input-mode-keyboard.svg)](http://badge.fury.io/js/inch-plugin-input-mode-keyboard)
[![Build Status](https://travis-ci.org/distributedlife/inch-plugin-input-mode-keyboard.svg)](https://travis-ci.org/distributedlife/inch-plugin-input-mode-keyboard)
[![Coverage Status](https://img.shields.io/coveralls/distributedlife/inch-plugin-input-mode-keyboard.svg)](https://coveralls.io/r/distributedlife/inch-plugin-input-mode-keyboard)

# inch-plugin-input-mode-keyboard
Provides support for keyboard input (secretly mouse and touch too, but they'll move to their own modules in their own time).

# Usage
It's not included by default, so you should add it to your client-side configuration.

```javascript
pluginManager.use(require('inch-plugin-input-mode-keyboard'));
```

You also need to configure some bindings on the server side. These bindings round the input to your logic.

```javascript
var myFunc = function () {
	console.log('the space bar was pressed');
};
var actionMap = {
    'space': [{target: myFunc()}],
};
var inputHandler = require('inch-input-handler')(actionMap);
```

See the ['inch-input-handler'](https://github.com/distributedlife/inch-input-handler) for more information on how that aspect of it works.

# Alternatives
There are alternatives or can be used together with the keyboard. All are in various stages of completeness.

- [Mouse](https://github.com/distributedlife/inch-plugin-input-mode-mouse)
- [Touch](https://github.com/distributedlife/inch-plugin-input-mode-touch)
- [Gamepad Controllers](https://github.com/distributedlife/inch-plugin-input-mode-gamepad)
- [Virtual Gamepads](https://github.com/distributedlife/inch-plugin-input-mode-virtual-gamepad)
- [LeapMotion](https://github.com/distributedlife/inch-plugin-input-mode-leap-motion)

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.