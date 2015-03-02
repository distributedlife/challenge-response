[![Build Status](https://travis-ci.org/distributedlife/inch-plugin-state-mutator-default.svg)](https://travis-ci.org/distributedlife/inch-plugin-state-mutator-default)
[![npm version](https://badge.fury.io/js/inch-plugin-state-mutator-default.svg)](http://badge.fury.io/js/inch-plugin-state-mutator-default)
[![Coverage Status](https://coveralls.io/repos/distributedlife/inch-plugin-state-mutator-default/badge.svg?branch=master)](https://coveralls.io/r/distributedlife/inch-plugin-state-mutator-default?branch=master)

# inch-plugin-state-mutator-default
The inch.js game framework prefers it if you didn't mutate state yourself. When you write behaviour you should return the state changes you want to happen. The state mutator will do the mutation for you. This frees your behaviour code up. It becomes less complex, it becomes easier to test, it becomes functional.

# Usage
You need to require this plugin to use it. Once you've done that, most of the work is done, it's currently used by the inch-plugin-behaviour-invoker. It's part of the shell that handles state mutation. This alleviates all game logic from having to mutate state.

```javascript
pluginManager.load(require('inch-plugin-state-mutator-default'));
```

It's likely that you will want access to the state, you can do this via a direct call to the pluginManager.

```javascript
var stateAccess = pluginManager.get('StateAccess');
```

If you want to get a value from state you use the get function

```javascript
stateAccess.get("my-property");
stateAccess.get("my-object")("my-child-property");
```

# The inch.js framework
This repository is just one part of the [icnh.js game framework](http://github.com/distributedlife/inch.js).