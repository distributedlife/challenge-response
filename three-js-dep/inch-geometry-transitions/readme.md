# inch-geometry-transitions
Used for transitioning aspects of three.js geometry. Currently you can change the scale, colour and alpha using leaping. Future support will involved tween.js and easing functions.

You’ll interact through the api and probably won’t create one of these yourself. It’s mixed into the base geometry.

All functions take a duration in seconds. When set to zero the application is immediate.

- changeColour(duration, to): Morphs the current colour to the new one. Takes and array of [r,g,b]
- transitionColour(duration, from, to): Morphs between from and to. Both are an array of [r, b, b]
- fadeIn(duration, finalOpacity): fades the geometry into the desired opacity (0.0 - 1.0). If not set is defaulted to 1.0
- fadeOut(duration): fades the geometry out (opacity = 0.0)
- scale(duration, from, to): scales the geometry evenly in all dimensions. Scale is > 0.0

# Alternatives
The three.js meshes are closed in values. You can’t change them without going through this kind of API. If you don’t like it, roll your own geometry.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.