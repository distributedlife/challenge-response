#inch-plugin-behaviour-invoker-default
This sounds like the kind of crap you'd find in a Java stacktrace.

Ok. Hang on.

So the inch.js framework doesn't let game code get executed all willy-nilly. On the server side it's event driven or time driven. Anyway, either way the game code isn't allow to mutate state. This wires the game code up to the state mutator on behalf of the gamedev.

Secondly this code also lets whoever is calling it to dump an array of optional data in. Some events might like to pass in event related data. If an array comes in, then the array is unfurled and passed in as individual parameters.

So this code is the glue between the game code (behaviour) and the state mutation... It *invokes* the game code and as per the default behaviour it defers to the state mutator for *work*.

Naming things is hard.

And I could have done a better job of not coupling the behaviour invoker to the state mutator.

# Usage
For game developers, you just need to load the plugin:

```javascript
pluginManager.load(require('inch-plugin-behaviour-invoker-default'));
```

If you're writing inch.js code then you'll be doing something like this:

```javascript
var invoker = pluginManager.get('BehaviourInvoker');
invoker(gameFunc, state, optionalData);
```