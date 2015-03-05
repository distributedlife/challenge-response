# inch-client-assembler
There are many options you can configure for the inch.js framework. You load the options you want using the inch-plugins module. Pass that module in here and it'll assemble it all.

# Usage
Here is the minimum you need to do to assemble a client.

```javascript
"use strict";

var pluginManager = require('inch-plugins');
pluginManager.set('Window', require('window'));
pluginManager.load(require('inch-plugin-render-engine-adapter-threejs'));

var clientSideEngine = require('inch-client-assembler')(pluginManager);
clientSideEngine.assembleAndRun();
```

# Alternatives
- None as yet.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.