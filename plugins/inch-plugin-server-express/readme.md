[![npm version](https://badge.fury.io/js/inch-server-express.svg)](http://badge.fury.io/js/inch-server-express)
[![Build Status](https://travis-ci.org/distributedlife/inch-server-express.svg?branch=master)](https://travis-ci.org/distributedlife/inch-server-express)
[![Coverage Status](https://img.shields.io/coveralls/distributedlife/inch-server-express.svg)](https://coveralls.io/r/distributedlife/inch-server-express)

# inch-server-express
Every inch.js game requires a server to be the true-source of game logic and state. Most of the work on the server is agnostic of hosting platform. This module uses express-4x to host the files / routes. If you wanted a different server you'd write a replacement for this.

# Usage
Here is an example of loading the server and passing in the path to the game files, the supported game modes and the custom HTML code for each game model

```javascript
"use strict";

var modes = {
    'arcade': require("./game/js/modes/arcade")
};

require("inch-server-express").Server("./game", modes, custom).start();
```