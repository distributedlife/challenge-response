'use strict';

module.exports = {
  type: 'Level',
  func: function () {
    var $ = require('zepto-browserify').$;
    var numeral = require('numeral');

    var updatePlayerCount = function (currentValue) {
      $('#player-count').text(numeral(currentValue).format('0a'));
    };
    var updateObserverCount = function (currentValue) {
      $('#observer-count').text(numeral(currentValue).format('0a'));
    };

    return {
      screenResized: function () {
        return undefined;
      },
      setup: function (scene, ackLastRequest, register, tracker) {
        var playerCount = function (state) { return state.inch.players; };
        var observerCount = function (state) { return state.inch.observers; };

        tracker.onChangeOf(playerCount, updatePlayerCount);
        tracker.onChangeOf(observerCount, updateObserverCount);
        }
    };
  }
};