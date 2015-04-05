# Game URLs / Routes
The ICNH framework sets up urls that the player will use to access your game. The first route is the index or '/'. More routes exists based on the complexity of your game. Game modes e.g. arcade, endless, etc generate routes, as does and whether you have levels.

I'll use the two demo games as an example. Challenge:Repsonse comes with three modes: easy, hard, sound-only and visual-only. The solitare game has one mode.

# Single Mode Game
The most simple scenario is where you have a single mode for your game. You don't want to have levels or gameplay variations e.g. easy, hard, arcade, etc.

This means the index page will be your game. Your url will be something like: https://solitare.inch-games.com/

To achieve this your `modes.js` file will look like this:

```javascript
module.exports = "GameMode-Arcade";
```

In the `modes/` path you'll need to include a file that you register as "GameMode-Aracde". The convention would be to call that file `modes/arcade.js`.

```javascript
module.exports = {
  type: 'GameMode-Arcade',
  func: function() {
    return function() {
      //...
    };
  }
};
```

# Different Modes
You may have different modes for your game. This could be a game like Challenge:Response where there are four modes. Or you may have an endless mode where the ability to endure becomes more important.

Your `modes.js` file will become a hash rather than a single key.

```javascript
module.exports = {
  'easy': "GameMode-Easy",
  'hard': "GameMode-Hard",
  'visual-only': "GameMode-VisualOnly",
  'audio-only': "GameMode-AudioOnly"
}
```

You'll end up with five urls:

- `https://challenge-response.inchgames.com/` – This is the index page that will be a static path. You can style this as HTML and this is where you'll provide links to the game modes
- `https://challenge-response.inchgames/easy` – This will load the easy version of the game.
- `https://challenge-response.inchgames/hard` – This will load the hard version of the game
- `https://challenge-response.inchgames/visual-only` – This will load the visual only version of the game
- `https://challenge-response.inchgames/audio-only` – This will load the audio only version of the game

**Note**: *As the game modes are part of the url you need to adhere to the existing rules around url creation. You'll have no troubles if you stick to alphanumeric characters, dashes and underscores.*

As above you'll need to create JavaScript files in the `modes/` folder. One for each game mode you support.

These will have the same format as the single mode arrangement. The important thing to remember is that the keys: `GameMode-VisualOnly`, etc need to match.
