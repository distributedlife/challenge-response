"use strict";

var _ = require('lodash');
var io = require('socket.io-client');
var $ = require('zepto-browserify').$;

module.exports = {
  deps: ["Window", "ConnectDisconnectBehaviour", "InputMode", "GameMode"],
  type: "SocketBehaviour",
  func: function (window, ConnectDisconnectBehaviour, InputModes, GameMode) {
    return {
      SocketBehaviour: function (flushPendingAcks) {
        var controls = [];

        var configureEmitFunction = function (socket) {
          return function () {
            var packet = {
              pendingAcks: flushPendingAcks(),
              sentTimestamp: Date.now()
            };

            _.each(controls, function (control) {
              _.extend(packet, control.getCurrentState());
            });

            socket.emit('input', packet);
          };
        };

        return {
            connect: function (setupFunc, updateFunc) {
              var socket = io.connect('http://localhost:3000/' + GameMode() + '/primary');

              if (window().document.hasFocus()) {
                  socket.emit('unpause');
              }

              socket.on('connect', ConnectDisconnectBehaviour().connected);
              socket.on('disconnect', ConnectDisconnectBehaviour().disconnected);
              socket.on('gameState/setup', setupFunc);
              socket.on('gameState/update', updateFunc);
              socket.on('error', function (data) { throw new Error(data); });

              $(window()).on('blur', function () { socket.emit('pause'); });
              $(window()).on('focus', function () { socket.emit('unpause'); });
              $(window()).on('mousedown', function () { socket.emit('unpause'); });
              $(window()).on('mouseup', function () { socket.emit('unpause'); });

              _.each(InputModes(), function (InputMode) {
                controls.push(InputMode.InputMode());
              });

              setInterval(configureEmitFunction(socket), 1000 / 120);
            }
        };
      }
    };
  }
};