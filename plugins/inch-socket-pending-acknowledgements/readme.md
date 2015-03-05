# inch-socket-pending-acknowledgements
Sometimes it's nice to know that a client has received a packet. All packets get there in the end because it's a TCP connection. However you might have some logic that is driven by the client receiving a message. This module facilitates this.


# Usage
This is baked into the standard setup. You don't need to do anything here.

To acknowledge a packet. Every level has a function passed into it called `ackLastRequest`.

```javascript
ackLastRequest('ack-this');   
```

To wire a server entity to be notified of the ack:

```javascript
var myFunction(ack) {
	console.log(ack.rcvdTimestamp);
};

var ackMap = {
    'ack-this': myFunction
};

require('inch-socket-support')(server, callbacks, ackMap);
```

# Alternatives
None.

# The inch Framework
This repository is just one part of the icnh game framework. I wanted a modularised game framework (like [voxel.js](http://voxeljs.com) or [crtrdg](http://crtrdg.com/) but one that follows my needs as a game developer. I’m sure it’s even possible to mix and match the modules from the above into the inch framework.