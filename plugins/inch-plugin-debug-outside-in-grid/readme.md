# inch-debug-outside-in-grid
This is a debug module that you can use to put a grid over your 2D page. You can use this grid for alignment or just to confirm that the webgl stuff is working.

# Usage
It's never included by default so you'll need to pass it in yourself.

```javascript
var spacing = 100;
var configuration = {
	debug: [require("inch-debug-outside-in-grid")(THREE, spacing)]
};

var engine = require('inch-client-assembler')(THREE, configuration);
engine.run();
```

# Alternatives
- [inch-debug-grid-top-left](https://github.com/distributedlife/inch-debug-grid-top-left): this grid runs from the top left corner to the bottom right corner
- [inch-debug-axes](https://github.com/distributedlife/inch-debug-axes): a 3D axes oriented over 0,0,0.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.