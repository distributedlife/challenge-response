# inch-geometry-alignment
Used to align the square bounding box of geometry with itself. Pass in the centre position, the width and height and the alignment options and it will return the new position.

The assumption is that the initial position supplied is the bottom left corner of the geometry.

# Usage
To centre the object on the point.

```javascript
var alignment = require(‘inch-geometry-alignment’);
var initial = {x: 100, y: 100};
var width = 100;
var height = 100;
var options = {
	horizontal: “centre”,
	vertical: “centre”
};

var newPos = alignment.toSelf2d(initial, width, height, options);

console.log(newPos.x === 50);
console.log(newPos.y === 50);
```

Options for horizontal:
- top
- centre/center
- bottom

options for vertical:
- left
- center/center
- right

# Alternatives
The geometry packages that can be pulled in for the inch framework e.g. inch-geometry-* all make use of this module. You don’t have to use these functions if you don’t want to.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.