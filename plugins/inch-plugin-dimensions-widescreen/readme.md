# inch-plugin-dimensions-widescreen
Determines the usable space of a screen so you can preserve aspect ratio. This allows you to resize the canvas to these dimensions and it’ll look the same on all devices and screens.

# Usage
This is the default dimensions so you don't have to do anything special. If you want to be explicit:

```javascript
pluginManager.use(require('inch-plugin-dimensions-widesreen'));
```

To use it within a module:

```javascript
pluginManager.get('Dimensions').Dimensions();
```


# Alternatives
- inch-plugin-dimensions-fillscreen
- Roll your own.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.