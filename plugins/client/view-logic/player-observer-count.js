'use strict';

var numeral = require('numeral');

module.exports = {
  type: 'Level',
  deps: ['StateTracker'],
  func: function (tracker) {
    var $ = require('zepto-browserify').$;

    var updatePlayerCount = function (currentValue) {
      $('#player-count').text(numeral(currentValue).format('0a'));
    };
    var updateObserverCount = function (currentValue) {
      $('#observer-count').text(numeral(currentValue).format('0a'));
    };

    return {
      setup: function () {
        var playerCount = function (state) { return state.inch.players; };
        var observerCount = function (state) { return state.inch.observers; };

        tracker().onChangeOf(playerCount, updatePlayerCount);
        tracker().onChangeOf(observerCount, updateObserverCount);
        }
    };
  }
};