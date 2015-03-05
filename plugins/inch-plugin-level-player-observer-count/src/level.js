"use strict";

module.exports = {
    type: "Level",
    func: function () {
        var $ = require("zepto-browserify").$;
        var the = require("inch-state-tracker").The;
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
                tracker.onChangeOf(the('players'), updatePlayerCount);
                tracker.onChangeOf(the('observers'), updateObserverCount);
            }
        };
    }
};