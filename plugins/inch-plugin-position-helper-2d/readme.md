# inch-position2d-helper
A set of functions for helping you put things in the right spot.  Like left, top, bottom, right, centreX, centreY. Also contains function for splitting grid into arbitrary number of slices and then getting the x or y for that slice.

# Usage
```javascript
var PositionHelper = require(‘inch-position2d-helper’);

position: {
	x: PositionHelper.ss.left(),
	y: PositionHelper.ss.centreY(),
},
```

## Methods
- left: returns the left hand size of the screen space. This is not zero if there is a right margin.
- right: returns the right hand side of the screen space. This is not equal to the screen width if there is a right hand side margin.
- top: returns the top of the screen, this is either 0 or the margin size.
- bottom: returns the bottom of the screen. This is the screen height minus the margin. 
- centreX: The centre of the screen
- centreY: The centre of the screen
- gridNx: takes two params, the number of slices and which slice do you want. grid4x(4,1) divides the screen into quarters and then gives you the first slice.
gridNy: takes two params, the number of slices and which slice do you want. grid4y(4,1) divides the screen into quarters and then gives you the first slice.

# Alternatives
Position things yourself. If you’re doing text then you should look into overlays and using HTML and CSS. It’s much better that way.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.