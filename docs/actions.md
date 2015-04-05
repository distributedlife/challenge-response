# Actions
The action map is how you respond to the player interacting with your game. For each mode you have the ability to map user input to functions. When user submits input on the client, the server invokes the function.

The action map can specify keys, mouse movement and clicks, touches and game controllers. The action map is also used to call a function when there is no input.

## An example
The following example shows how to define an action map. Register the action map as a plugin. Do this during the game mode setup.

```javascript
definePlugin()('ActionMap', function () {
  return {
    'space': [{target: jump(), keypress: true}],
    'a': [{target: left()}],
    'd': [{target: right()}],
  };
});
```

## Multiple Callbacks
When defining an input mapping it's possible to supply more than one function for each key. Consider a game where each time the player shoots they suffer fatigue. This could be the same function, but it's best if it it's not.

All action maps bindings accept an array.

```javascript
{
  'space': [
    {target: shoot()},
    {target: fatigue()}
  ]
}
```

## Standard Callback Data
Each callback gets some optional, specific data for the event. This may be the x and y coordinate of the mouse or the force of the gamepad stick. All callbacks regardless of their type get an extra object with some standard information about the callback.

```javascript
var data = {
  rcvdTimestamp: //timestamp when the server received the event
};
```

## Keyboard
Keyboard input comes in two flavours. The keypress: with one event per keypress. The second is continual: the event repeats continually until the user releases the key.

When defining your keymap, use the keypress flag to declare which events are keypresses and which are continual. In the example below: the player's avatar will jump once each `space` press. The keys `a` and `d` map to continual functions.

```javascript
{
  'space': [{target: jump(), keypress: true}],
  'a': [{target: left()}],
  'd': [{target: rigth()}]
};

var jump = function (data) {
  // jump up
};

var left = function (data) {
  // move left
};

var right = function (data) {
  // move right
};
```

The following keys use special strings:
  - tab
  - control
  - alt
  - escape
  - space
  - left
  - up
  - right
  - down

All other keys are their ASCII label.

## Mouse Buttons
Mouse buttons behave the same way as keys. No support for handling a `mousepress` event exists.

```javascript
{
  'button1': [{target: shoot()}]
}

var shoot = function (data) {
  // pew pew
};
```

Support exists for the following buttons:
  - button1 – the primary (left) button
  - button2 – the contextual-menu (right) button

## Mouse Movement
Mouse movement is a separate event that repeats regardless of whether the mouse has moved.

```javascript
{
  'cursor': [{target: moveCamera()}]
}

var moveCamera = function (x, y, data) {
  //adjust camera to focus on the x and y coordinates.
}
```

**Note**: *Mouse movement events never influence the no event callback.*

## Touches
Touch input is different to other input methods because you are binding to each the order of concurrent touches. `touch0` is the first touch and `touch1` is the second touch, when started before `touch0` completes. Otherwise `touch1` comes across the wire as `touch0`.

```javascript
{
  'touch0': [{target: verify()}]
}

var verify = function (x, y, data) {
  //Did the player touch in the correct sport?
}
```

## No Input
To receive a callback when no input occurred we mark normal input event bindings with a special key: `noEventKey`. If any of the bindings marked with the key receive input our no event callback is not executed. If none of the bindings receive input then our no event callback executes.

Most input types will accept a noEventKey. This allows you to select which inputs will influence the `nothing` callback. The mouse movement input type does not influence the no event callback.

In the example below, if `space` is not pressed, the `umm` callback executes. If the screen is not touched then the `umm2` callback executes.

```javascript
{
  'space': [
    {target: shoot(), noEventKey: 'Alpha'}
  ],
  'touch0': [{target: verify(), noEventKey: 'Beta'}]
  'nothing': [
    {target: umm(), noEventKey: 'Alpha'},
    {target: umm2(), noEventKey: 'Beta'}
  ]
}

var umm = function (data) {
  //Nothing happened. Jazz it up!
}
```