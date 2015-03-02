# inch-sequence
Helps you manage a sequence. Starts with 1. Let’s you track multiple sequences

# Usage
```javascript
require(‘inch-sequence’).next(‘my-key’); //1
require(‘inch-sequence’).next(‘my-key’); //2
require(‘inch-sequence’).next(‘different-key’); //1
```

You can check to see if a key is already in use. Can be useful for existing key clashes.

```javascript
require(‘inch-sequence’).exists(‘my-key’); //true
require(‘inch-sequence’).exists(‘saturday’); //false
```

# Alternatives
Track your own sequences. This module is used within some of the inch-framework sequences. There is a chance of collisions occurring. Use exists to check for keys that already exist. It won’t help you find keys that are used but haven’t been invoked yet.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.

## Separate the game-loop and render-loop
A separation of the game loop and the render loop. The idea is that the render loop should be a representation of your game state and the code should be separate. Because of this you'll find no `.on('draw', function() {})` event handlers. On entities there is no `entity.draw` function for you to overload. The entity goes about it's merry way. In the renderer you can do things like this: 

```javascript
myGraphicalRepresentation.updateFromModel(readOnlyState).
```

## No explicit wiring
No explicit wiring between modules. The *inch-game-state* module has an property that contains the duration. There is also an update function that increases the duration by the time-delta. One could pass the game_state into the engine and the engine could call `game_state.update(delta)`. This is not what I want. 

The engine shouldn't care about the game state. The short of it is that it doesn't. It takes an array of update functions, like so: `new engine([game_state.update.bind(game_state), someOtherFunction.update])`. When the engine goes through it's loop it call *all the update* functions. Bam! Our game state duration gets updated and nobody has to know anything about anyone else. 

We'll you do, but that's why we are here.