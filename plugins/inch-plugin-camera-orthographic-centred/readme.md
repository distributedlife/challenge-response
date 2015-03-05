# inch-plugin-camera-orthographic-centered
Makes an orthographic camera for you. They’re not too hard to make but this just makes it a bit easier. The coordinates 0,0 are in the centre of the screen.

# Usage
Normally you would just pass the require into the framework config and it’ll all happen for you. If you want to make one yourself you can use it like so:

```javascript
pluginManager.use(require('inch-plugin-camera-orthographic-centred’));
```

If you are using it inside another module, you can create camera like so:

```javascript
var camera = pluginManager.get('Camera').Camera();
```

# Alternatives
- [Orthographic Camera](https://github.com/distributedlife/inch-plugin-camera-orthographic)
- [Perspective Camera](https://github.com/distributedlife/inch-plugin-camera-perspective)
- Roll your own.

# The inch Framework
This repository is just one part of [icnh.js](https://github.com/distributedlife/inch.js). I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.