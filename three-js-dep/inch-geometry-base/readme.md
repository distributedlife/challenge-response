# inch-geometry-base
Base for all geometry as it sets up sensible defaults, simplifies three.js creation and returns the only bit worth worrying about: the mesh.

# Usage
Not used directly. Here is example from circle.js

```javascript
"use strict";

var _ = require('lodash');
var temporaryEffect = require('inch-temporary-effect');
var geometryTransitions = require("inch-geometry-transitions");
var base = require("inch-geometry-base")(THREE);

var inch_3js_mesh = require("./threejs-mesh-helper")

module.exports = function(on_create, on_destroy, settings) {
	var current = {};
	_.defaults(current, base.defaults(settings));
	
	var positionCallback = function(mesh) {
		var adjusted = current.position;
		adjusted.x += current.radius;

		return adjusted;
	};

	var mesh = base.mesh.assemble(base.geometries.circle, base.materials.basic, positionCallback, on_create, current);

	return circle;
};
```

# Defaults
The following are the defaults used for all geometry.

```javascript
transparent: false,
alphaTest: 0.1,
blending: THREE.AdditiveBlending,
size: 20,
duration: 0,
alignment: {
	horizontal: "centre",
  vertical: "centre"
},
scale: 1.0,
colour: [1.0, 1.0, 1.0],
opacity: 1.0,
position: {x: 0, y: 0, z: 0},
start_hidden: false
```

# Alternatives
Do it all yourself. If you can get a mesh into the scene then you’ll be A-Ok.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.