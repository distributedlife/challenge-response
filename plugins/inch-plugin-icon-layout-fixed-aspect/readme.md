# inch-plugin-icon-layout-fixed-aspect
The standard inch.js screen contains a row of icons with things like audio, network connection, audio on/off, etc. Depending on whether you have a portrait or landscape view this module lays out those icons down the side or along the top.

# Usage
Currently configured as a default. So you don’t need to explicitly use this.

```javascript
pluginManager.use(require('inch-plugin-icon-layout-fixed-aspect'));
```

# Alternatives
- Have no icons.
- Roll your own.


# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.