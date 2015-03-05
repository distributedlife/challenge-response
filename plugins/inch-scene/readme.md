# inch-scene
This wraps the three.js scene object. I do this for two reasons. The first is to allow any number of meshes to be added at once.

```javascript
threeJsScene.add(mesh1);
threeJsScene.add(mesh2);

//vs.

inchScene.add(mesh1, mesh2);
```

The second is for the resetting the scene. To do this you need to know all the things in the scene and remove them one by one. The Inch Scene keeps track of whats in the scene so you can call `reset` and it’ll just go away.

# Usage
Normally you don’t create this, it gets created and then passed into your level module closure. 

If you were to make one…

```javascript
var threeJsScene = new THREE.Scene();
var InchScene = require(‘inch-scene’);
var inchScene = InchScene(threeJsScene);
```

## Things you can call
- add: takes one or more meshes and adds them to the scene
- remove: removes one or more meshes from the scene
- reset: removes all meshes from the scene
- scene: the underlying three.js scene object.

# Alternatives
If you don't want to use this then you don't have to use it. Just call `scene()` and get the underlying three.js scene object and do what you would have done before.

# The inch Framework
This repository is just one part of the [icnh game framework](https://github/distributedlife/inch-framework). I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) and [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.