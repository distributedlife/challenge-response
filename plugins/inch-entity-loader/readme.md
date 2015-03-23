# inch-entity-loader
Give it a path and it’ll load all the `.js` files in that path. Then it’ll return a hash where the key is the filename and the value is the file having been *required*.

e.g. You have a folder called entities with player.js containing:
```javascript
module.exports = {
	health: 50
};
```

var entities = require(‘inch-entity-loader’).loadFromPath(‘game/entities’);
console.log(entities.player.health === 50);

# Usage
Best used to load up all your entities to charge your game state.
var entities = require(‘inch-entity-loader’).loadFromPath(‘game/entities’);

```javascript
var gameState = require('inch-game-state').andExtendWith({
	player: new entities.player(),
});
```

# Alternatives
If you don't want to use this then you don't have to use it. This just requires a folder in a fashion that makes life easier for me. You’re welcome to require all the things yourself.

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