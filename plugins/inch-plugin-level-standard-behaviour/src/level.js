"use strict";

module.exports = {
    type: "Level",
    func: function () {
        var $ = require("zepto-browserify").$;
        var equals = require("inch-state-tracker").Equals;
        var the = require("inch-state-tracker").The;
        // var Howler = require('howler').Howler;

        var pause = function () {
            $('.paused').show();
            $('#paused').show();
            // Howler.pauseAll();
        };
        var resume = function () {
            $('.paused').hide();
            $('#paused').hide();
            // Howler.resumeAll();
        };

        return {
            screenResized: function () {
                return undefined;
            },
            setup: function (scene, ackLastRequest, register, tracker) {
                tracker.onChangeTo(the('paused'), equals(true), pause);
                tracker.onChangeTo(the('paused'), equals(false), resume);
            }
        };
    }
};