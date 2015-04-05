# Acknowledgement Map
The acknowledgement map is how we know that a state has reached the client. At present, this is **any** of the gamer's clients. The current use case is determining when the **client** has seen something. The [Challenge:Response](/todo) game uses this to start the timer after the player seens the challenge.

## Server Side
Like the input map, the acknowledgement map is just a mapping of acknowledgements to functions.

```javascript
var onAck = function(ack) {
  //ack.rcvdTimestamp
};

pluginManager.load(define("AcknowledgementMap", function () {
  return {
    ‘my-key’: [{target: onAck }]
  };
}));
```

## Client Side
To send an ack from the client you can use the `ackLastRequest` method supplied to each view partial.

```javascript
ackLastRequest('my-key');
```
