# inch-connect-disconnect-behaviour
The socket code requires two callbacks that are called when a client connects and disconnects. The disconnect isn't necessarily due to the player leaving the page. So it's good to consider that.

This module provides two simple callbacks to hide and show a disconnect icon.

# Usage
It's included by default. So you don't have to do much.


# Alternatives
If you want to write your own you include the behaviour in your configuration:


```javascript
var configuration = {
	connectDisconnectBehaviour: {
		connect: function() { console.log("the player has connected"); },
		disconnect: function() { console.log("the player has disconnected"); }
	}
};

var engine = require('inch-client-assembler')(THREE, configuration);
engine.run();
```

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.