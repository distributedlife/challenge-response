"use strict";

module.exports = {
    deps: ["PositionHelper"],
    type: "Level",
    func: function (PositionHelper) {
        var $ = require('zepto-browserify').$;
        var equals = require("inch-state-tracker").Equals;

        return {
            screenResized: function () {
                //TODO: do we need to reposition all the things?
            },
            setup: function (scene, ackLastRequest, register, tracker, camera) {
                var showGameOver = function () {
                    $("#gameOver").show();
                };

                var updateTheNumberOfAttempts = function (model) {
                    $("#attempts")[0].innerText = model;

                    var score = $("#attempts");
                    var centered = PositionHelper.centreInCamera(camera, score.width(), score.height());

                    score.css('left', centered.left + 'px');
                    score.show();
                };

                var updateTheTotal = function (model) {
                    $("#total")[0].innerText = model;

                    var score = $("#total");
                    var centered = PositionHelper.centreInCamera(camera, score.width(), score.height());

                    score.css('left', centered.left + 'px');
                    score.show();
                };

                var theNumberOfAttempts = function (state) { return state.controller.attempts; };
                var theTotal = function (state) { return state.controller.total; };

                var theGameState = function (state) { return state.controller.state; };

                tracker.onChangeTo(theGameState, equals('gameOver'), showGameOver);
                tracker.onChangeOf(theNumberOfAttempts, updateTheNumberOfAttempts);
                tracker.onChangeOf(theTotal, updateTheTotal);
            }
        };
    }
};