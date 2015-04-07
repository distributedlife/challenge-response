'use strict';

var each = require('lodash').each;
var reject = require('lodash').reject;

module.exports = {
  deps: ['Dimensions', 'Level', 'OnMuteCallback', 'OnUnmuteCallback', 'StateTracker'],
  type: 'DisplayBehaviour',
  func: function (dimensions, levelParts, onMuteCallbacks, onUnmuteCallbacks, tracker) {
    var effects = [];
    var priorStep = Date.now();
    var lastReceivedId = 0;

    var setupComplete = false;

    require('./enable-fullscreen')();
    require('./toggle-sound')(onMuteCallbacks(), onUnmuteCallbacks());

    return {
      Display: function (ackLast, addAck) {
        var dims = dimensions().get();

        each(levelParts(), function (levelPart) {
          if (levelPart.screenResized) {
            levelPart.screenResized(dims);
          }
        });

        var registerEffect = function (effect) {
          effects.push(effect);
        };

        var setup = function (state) {
          tracker().updateState(state);

          each(levelParts(), function (levelPart) {
            if (levelPart.setup) {
              levelPart.setup(
                ackLast,
                registerEffect
              );
            }
          });

          setupComplete = true;
        };

        var update = function (packet) {
          addAck(packet.id);

          if (packet.id <= lastReceivedId) {
            return;
          }
          lastReceivedId = packet.id;

          tracker().updateState(packet.gameState);
        };

        var doUpdate = function () {
          var now = Date.now();

          var dt = (now - priorStep) / 1000;
          priorStep = Date.now();

          each(levelParts(), function (levelPart) {
            if (levelPart.update) {
              levelPart.update(dt);
            }
          });

          if (!setupComplete) {
            return;
          }

          each(effects, function (effect) {
            effect.tick(dt);
          });

          effects = reject(effects, function (effect) {
            return !effect.isAlive();
          });
        };

        var dontUpdate = function () {
          priorStep = Date.now();
        };

        var paused = function (state) { return state.inch.paused; };

        return {
          setup: setup,
          update: update,
          updateDisplay: function () {
            if (tracker().get(paused)) {
              dontUpdate();
            } else {
              doUpdate();
            }
          },

          resize: function (dims) {
            each(levelParts(), function (levelPart) {
              if (levelPart.screenResized) {
                levelPart.screenResized(dims);
              }
            });
          }
        };
      }
    };
  }
};