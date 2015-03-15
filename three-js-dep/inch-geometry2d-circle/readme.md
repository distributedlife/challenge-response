# inch-geometry2d-circle
This is the module you use if you want a 2d circle in your game. 

# Usage
Example usage, all values are optional. Please see [inch-geometry-base](https://github.com/distributedlife/inch-geometry-base) for defaults. The ones listed here are specific to this module.

```javascript
var Circle = require(‘inch-geometry2d-circle’);

var circle = new Circle(scene.add, scene.remove, {
	radius: 100,
	segments: 32
});
```

# Alternatives
Roll your own.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.