# inch-font-helvetiker_regular
If you want to use the text that is made out of geometry you are going to need at least one font.

This is one of those fonts.

This module currently delegates to the [inch-render-engine-adapter](https://github.com/distributedlife/inch-render-engine-adapter) to do the loadFont work.

All the font loading code is from [three.js](https://github.com/mrdoob/three.js) and [typeface.js](http://typeface.neocracy.org/). The typefaces are also from [typeface.js](http://typeface.neocracy.org/).

# Usage
This is how you load a font:

```javascript
pluginManager.use(‘inch-font-helvetiker_regular’);
```

# Alternatives
- Roll your own geometry.
- Or, take a look at using html/css to put text on the page. It’ll be faster and will look nicer.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.