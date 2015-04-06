'use strict';

var each = require('lodash').each;
var extend = require('lodash').extend;
var $ = require('zepto-browserify').$;

//jshint maxparams: 6
module.exports = {
  deps: ['Window', 'InputMode', 'GameMode', 'ServerUrl', 'OnConnect', 'OnDisconnect'],
  type: 'SocketBehaviour',
  func: function (window, inputModes, gameMode, serverUrl, onConnectCallbacks, onDisconnectCallbacks) {
    return {
      SocketBehaviour: function (flushPendingAcks) {
        var controls = [];

        var configureEmitFunction = function (socket) {
          return function () {
            var packet = {
              pendingAcks: flushPendingAcks(),
              sentTimestamp: Date.now()
            };

            each(controls, function (control) {
              extend(packet, control.getCurrentState());
            });

            socket.emit('input', packet);
          };
        };

        return {
            connect: function (setupFunc, updateFunc) {
              var io = require('socket.io-client');

              var socket = io.connect(serverUrl() + gameMode() + '/primary', {reconnection: false});

              if (window().document.hasFocus()) {
                  socket.emit('unpause');
              }

              each(onConnectCallbacks(), function (callback) {
                socket.on('connect', callback);
              });
              each(onDisconnectCallbacks(), function (callback) {
                socket.on('disconnect', callback);
              });

              socket.on('gameState/setup', setupFunc);
              socket.on('gameState/update', updateFunc);
              socket.on('error', function (data) { throw new Error(data); });

              $(window()).on('blur', function () { socket.emit('pause'); });
              $(window()).on('focus', function () { socket.emit('unpause'); });
              $(window()).on('mousedown', function () { socket.emit('unpause'); });
              $(window()).on('mouseup', function () { socket.emit('unpause'); });

              each(inputModes(), function (inputMode) {
                controls.push(inputMode.InputMode());
              });

              var id = setInterval(configureEmitFunction(socket), 1000 / 120);
              socket.on('disconnect', function () {
                clearInterval(id);
              });
            }
        };
      }
    };
  }
};