# inch-vsync-update-loop
Client side update loop that uses requestAnimationFrame to call the supplied update function. Currently passes the current time in.

Future versions will pass down the delta as well.

# Usage
Currently configured as a default. So you don’t need to explicitly use this.

# Alternatives
You can roll your own update loop and then pass it in using the configuration.

```javascript
plugingManager.use(require('my-update-loop'));
```

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.