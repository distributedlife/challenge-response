"use strict";

module.exports = {
    deps: ["OnPauseCallback", "OnResumeCallback"],
    type: "Level",
    func: function (OnPauseCallbacks, OnResumeCallbacks) {
        var each = require("lodash").each;
        var $ = require("zepto-browserify").$;
        var equals = require("../../inch-state-tracker/src/tracker.js").Equals;
        var the = require("../../inch-state-tracker/src/tracker.js").The;

        var pause = function () {
            $('.paused').show();
            $('#paused').show();

            each(OnPauseCallbacks(), function(onPauseCallback) {
                onPauseCallback();
            });
        };
        var resume = function () {
            $('.paused').hide();
            $('#paused').hide();

            each(OnResumeCallbacks(), function(onResumeCallback) {
                onResumeCallback();
            });
        };

        return {
            setup: function (scene, ackLastRequest, register, tracker) {
                tracker.onChangeTo(the('paused'), equals(true), pause);
                tracker.onChangeTo(the('paused'), equals(false), resume);
            }
        };
    }
};