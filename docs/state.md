# Game State
All games get state. The frameworks starts off with a small core of state that applies to every game using the framework. This state contains the number of connected players, when the game started and is the game paused?

During the initialisation of your mode you can add state. Define your state using the plugin system. The framework will apply it in due time.

```javascript
definePlugin()('StateSeed', function () {
  return {
    'distributedlife': {
      controller: {
        start: 0,
        score: 0,
        state: 'ready',
        priorScores: []
      }
    }
  };
});
```

## Namespaced State
All state must have a namespace. This will reduce the accidental re-use of property names. In the example above the state the namespace is the word *distributedlife.com*.

The framework reserves the namespace *inch*. This is where the framework stores its state.

```javascript
{
  inch: {
    players: 0,
    observers: 0,
    paused: false,
    started: Date.now()
  }
}
```

## Immutable State
From the perspective of the gamedev, all state is immutable. This is by design. A goal of the framework was to reduce complexity in game code by removing the need for state and state change management from the gamedev. This enforces a functional style on game code. This makes your game code easier to test.

In the example below, the die function when executed returns that new player state.

```javascript
var die() {
  return {
    'distributedlife': {
      player: {
        alive: false;
      }
    }
  }
};
```

In the second example increase the player's health by 20% or 80% depending on the function we call. This example also shows how we can use closures to reduce code complexity

```javascript
module.exports = {
  type: 'GameBehaviour-Health',
  deps: ['StateAccess'],
  func: function (state) {
    var applyHealthBonus = function (percentBoost) {
      return function () {
        var currentHealth = state('distributedlife')('player')('health');

        return {
          'distributedlife': {
            player: {
              health: currentHealth + (currentHealth * percentBoost);
            }
          }
        };
      }
    };

    return {
      small: applyHealthBonus(0.25);
      large: applyHealthBonus(0.80);
    };
  }
};
```