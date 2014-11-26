"use strict";

module.exports = {
    deps: ["RenderEngineAdapter", "Window", "Dimensions"],
    type: "Level",
    func: function (adapter, window, Dimensions) {
        var colour = require('color');
        var PositionHelper = require("inch-position2d-helper");
        var equals = require("inch-state-tracker").Equals;

        var Circle = require('inch-geometry2d-circle')(adapter);

        var $ = require('zepto-browserify').$;

        return {
            screenResized: function (dimensions) {
                PositionHelper.updateScreenDims(dimensions.screenWidth, dimensions.screenHeight, dimensions.orientation, dimensions.margin);
            },
            setup: function (scene, ackLastRequest, register, tracker) {
                var show_instructions = function (model, prior_model, statusIndicator) {
                    $("#instructions").show();
                    $("#challenge").hide();
                    $("#results").hide();
                    $("#falsestart").hide();
                    statusIndicator.changeColour(0, colour("grey").rgbArray());
                };

                var hide_instructions = function (model, prior_model, statusIndicator) {
                    $("#instructions").hide();
                    statusIndicator.changeColour(0, colour("red").rgbArray());
                };

                var show_challenge = function (model, prior_model, statusIndicator) {
                    $("#challenge").show();
                    ackLastRequest('show-challenge');
                    statusIndicator.changeColour(0, colour("green").rgbArray());
                };

                var show_results = function (model, prior_model, statusIndicator) {
                    $("#challenge").hide();
                    $("#results").show();
                    statusIndicator.changeColour(0, colour("black").rgbArray());
                };

                var show_false_start = function (model, prior_model, statusIndicator) {
                    $("#falsestart").show();
                    statusIndicator.changeColour(0, colour("orange").rgbArray());
                };

                var update_score = function (model, prior_model) {
                    var dims = Dimensions.Dimensions();
                    var offset = dims.usableHeight / 2;
                    offset += dims.margin;
                    $("#centre-box").css("margin-top", offset);
                    $("#score").show();
                    $("#score")[0].innerText = model + "ms";
                };

                var statusIndicator = new Circle(scene.add, scene.remove, {
                    radius: 100,
                    segments: 80,
                    position: { x: 0, y: 0, z: -100}
                });
                register(statusIndicator);

                var the_game_state = function (state) { return state.controller.state; };
                var the_score = function (state) { return state.controller.score; };

                tracker.onChangeTo(the_game_state, equals('ready'), show_instructions, statusIndicator);
                tracker.onChangeTo(the_game_state, equals('waiting'), hide_instructions, statusIndicator);
                tracker.onChangeTo(the_game_state, equals('challenge_started'), show_challenge, statusIndicator);
                tracker.onChangeTo(the_game_state, equals('complete'), show_results, statusIndicator);
                tracker.onChangeTo(the_game_state, equals('false_start'), show_false_start, statusIndicator);
                tracker.onChangeOf(the_score, update_score);
            }
        };
    }
};