# inch-render-engine-adapter-threejs
The three.js render engine adapter provides a buffer between the inch.js framework and three.js. Three.js is great but we don't want to couple ourselves to it too much. The long term goal may to switch out the render engine in future. In the short term it makes it more simple to use three.js in an inch.js project. This is because three.js can only be required once. If you do it twice the `instanceof` calls that are made in three.js will fail and you'll get an error.

# Usage
It's not included by default so you need to require it up and then pass it into the assembler.

```javascript
var adapter = require('inch-render-engine-adapter-threejs');
var clientSideEngine = require('inch-threejs-client-assembler')(adapter, window);
```

# Alternatives
There are none at the moment but i'm sure you could write an adapter for [pixi.js](http://www.pixijs.com/)

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.