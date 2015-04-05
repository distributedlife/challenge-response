# Plugins
At some point in your life you're going to interact with the INCH plugin system. You have two options: load a plugin or define your own.

## Loading a Plugin
Loading a plugin is pretty easy to do. The important thing is to have access to the `plugin manager`. The most common place you'll do this is in the client side entry point. Here you'll create a plugin manager and then load in all the plugins that you need.

```javascript
var plugins = require('./plugins/inch-plugins/src/plugin_manager.js').PluginManager;
plugins.load(require("/path/to/my/plugin.js"));
```

**Remember**: You need `require` the file before `loading` it.


## Defining a Plugin
More often than not you'll be defining a plugin. Defining a plugin is writing code that'll another part of the system executes. More often than not where you define your code will be far removed from where it executes.

This will force your plugins to be self-contained. This is a design goal.

### Roles
A plugin fills a role. You can think of these as types from a typed language. Each role defines an implicit interface. Adhere to that implicit interface and all will be well.

Most interfaces are trending towards being a single function.

The key difference between this system and an existing JavaScript module loader i.e. CommonJs or require.js, is that those module loaders are about loading a specific module. Give me the async module, etc. This is about having a dependency on an interface i.e. give me whoever fills the async role. Or, for arrays, give me everyone who claims to do that role.
The appendix at the end of this page lists all the defined roles. You can define your own and no-one will notice... unless there is a role name clash.

### Namespaces

You probably namespace any roles that you define yourself.

`Server`

vs.

`AndyGame-Server`

### Examples

Each plugin has some accompanying boilerplate. You have define the role (known as type). You can define your dependencies and supply a function that accepts those dependences.

require.js inspired the define format.


#### Returning a function (and how to use dependencies)
```javascript
"use strict";

// static includes
var each = require('lodash').each;

module.exports = {
    type: "Effectasaurus",
    deps: ["EffectMapper"],
    func: function (effectMapper) {
        //Static and private properties and functions
        var effects = [];

        var addEffect = function (effect) {
            effects.push(effect);
        };

        //Or, return a new function that the consumer executes
        return function () {
            var particles = [];
            var addParticle = function (particle) {
                particles.push(particle);
            };

            return {
                publicProperty: "Seventeen",
                exposeAddParticle: function (particle) {
                    return add(particle);
                },
                exposeAddEffect: function (effectOptions) {
                    return addEffect(effectMapper()(effectOptions));
                }
            }
        }
    }
};
```
#### Returning a hash (also an example without dependencies)
```javascript
module.exports = {
    type: "ModuleWithNoDependencies",
    func: function () {
        //Static and private properties and functions
        var effects = [];

        //define a public interface.
        return {
            addEffect: function (effect) {
                effects.add(effect);
            }
        };
    }
};
```

#### Using DefinePlugin
There is a third approach where you can use the `DefinePlugin` plugin

```javascript
definePlugin()("IHasDependencies", ["DepA"], function (depA) {
    var effects = [];

    return {
        addEffect: function (effect) {
            effects.add(depA()());
        }
    };
});
```

#### Using Dependencies
One important thing to remember when using dependencies. You can't use them **during the define phase**. I make no promises about the module load order. Because of this you can't use the dependency until all the modules have loaded.

If you use your dependencies within the object you are returning, then you will be ok. Here is a code example that shows you the two places.

```javascript
definePlugin()("IHasDependencies2", ["DepB"], function (depB) {
    //Executed when the plugin loads
    //depB() <-- this will fail with "Plugin DebB not found."

    return function () {
        //Executed when the consumer invokes plugin.
        return depB();
    };
});
```

## Appendix - Existing Roles
These are the roles defined within the system:

### Server Side Plugins
- **AcknowledgementMap** `hash` – Maps acknowledgement events to game code.
- **ActionMap** `hash` – Maps input events to game code.
- **DefinePlugin** `function` – Let's you define and load a plugin.
- **DelayedEffects** `object` – Gives you access to register your own.
- **InitialiseState** `function` – Applies any pending `StateSeed` changes.
- **OnInput** `array`, `event`, `function` – Called when the client sends an input event.
- **OnObserverConnect** `array`, `event`, `function` – Called when an observer connects.
- **OnObserverDisconnected** `array`, `event`, `function` – Called when an observer disconnects.
- **OnPause** `array`, `event`, `function` – Called when a player pauses the game.
- **OnPlayerConnect** `array`, `event`, `function` – Called when a player connects.
- **OnPlayerDisconnected** `array`, `event`, `function` – Called when a player disconnects.
- **OnUnpause** `array`, `event`, `function` – Called when a client unpauses the game.
- **PluginManager** `object` – `deprecated` Provides full access to the plugin manager.
- **RawStateAccess** `hash` – The entire state. Consumed by `SocketSupport` for sending data over the wire.
- **Server** `object` – Sets up your server.
- **ServerSideEngine** `object` – The server side game engine.
- **ServerSideUpdate** `array`, `function` – Called once per iteration by the game engine.
- **SocketSupport** `object` – Sets up the socket and registers event handlers.
- **StateAccess** `function` – Provides **read** access to the game state.
- **StateMutator** `function` – Will apply the changes from the supplied function to the state. Called by the framework so the gamedev is not responsible for mutating state.
- **StateSeed** `hash`, `array` – Some initial server or game state.

### Client Side Plugins
- **AspectRatio** `constant` – What aspect ratio should we maintain when trying to create a canvas. The end result is the large canvas that can be rendering in the screen whilst maintaining the aspect ratio.
- **Camera** `object` – `deprecated` An abstraction to a render engine camera.
- **ConnectDisconnectBehaviour** `event`, `object` – Client side event callbacks for socket connection and disconnection.
- **DebugItems** `array` – `deprecated` Handy visual code that can help you debug three-js scenes.
- **DebugProperties** `hash` – `deprecated` Useful properties you'd like to pass down `Level` plugins.
- **Dimensions** `object` – Provides information about the current screen.
- **DisplayBehaviour** `object` – Important client side code that relates to displaying game stuff.
- **Element** `constant` – The element that the renderer attaches to.
- **Font** `` `array` – `deprecated` A three.js font.
- **FOV** `constant` – `deprecated` The current field of view.
- **GameMode** `constant` – What mode is this? e.g. arcade, endless?
- **IconLayout** `object` – A helper routine for laying out icons on the composite layer.
- **InputMode** `object`, `array` – A client side object that deals with a input and prepares it for transmission.
- **Level** `object`, `array` – Where you write your client side view code.
- **OnMuteCallback** `array`, `event`, `function` – Called when the current client mutes the sound.
- **OnPauseCallback** `array`, `event`, `function` – Called when the current client pauses.
- **OnResumeCallback** `array`, `event`, `function` – Called when the current client resumes the game.
- **OnUnmuteCallback** `array`, `event`, `function` – Called when the current client un-mutes the sound.
- **PluginManager** `object` – `deprecated` Provides full access to the plugin manager.
- **PositionHelper** `object` – Helps you place things on the canvas.
- **RenderEngineAdapter** `object` – `deprecated` Provides an abstraction between
- **SocketBehaviour** `event` `object` – Client side on connect behaviour.
- **UpdateLoop** `function` – Called once per frame on the client.
- **WidescreenMinimumMargin** `constant` – What is the smallest margin size to use when trying to calculate the canvas size.
- **Window** `native` - Provides access to the window object of the browser.