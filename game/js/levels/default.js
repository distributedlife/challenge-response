"use strict";

module.exports = {
    deps: ["RenderEngineAdapter", "Window", "Dimensions", "PositionHelper"],
    type: "Level",
    func: function (adapter, window, Dimensions, PositionHelper) {
        var colour = require('color');
        var equals = require("inch-state-tracker").Equals;
        var Circle = require('inch-geometry2d-circle')(adapter);
        var Howl = require('howler').Howl;

        var $ = require('zepto-browserify').$;

        return {
            screenResized: function (dimensions) {
                //TODO: do we need to reposition all the things?
            },
            setup: function (scene, ackLastRequest, register, tracker, camera) {
                var show_instructions = function (model, prior_model, statusIndicator) {
                    $("#instructions").show();
                    $("#challenge").hide();
                    $("#results").hide();
                    $("#falsestart").hide();
                    statusIndicator.changeColour(0, colour("grey").rgbArray());
                };

                var hide_instructions = function (model, prior_model, statusIndicator, waitingSound) {
                    $("#instructions").hide();
                    statusIndicator.changeColour(0, colour("red").rgbArray());
                    waitingSound.play();
                };

                var show_challenge = function (model, prior_model, statusIndicator, goSound, waitingSound) {
                    waitingSound.stop();
                    goSound.play();

                    $("#challenge").show();
                    ackLastRequest('show-challenge');
                    statusIndicator.changeColour(0, colour("green").rgbArray());
                };

                var show_results = function (model, prior_model, statusIndicator) {
                    $("#challenge").hide();
                    $("#results").show();
                    statusIndicator.changeColour(0, colour("black").rgbArray());
                };

                var show_false_start = function (model, prior_model, statusIndicator, goSound, waitingSound) {
                    $("#falsestart").show();
                    statusIndicator.changeColour(0, colour("orange").rgbArray());
                    goSound.stop();
                    waitingSound.stop();
                };

                var update_score = function (model, prior_model) {
                    $("#score")[0].innerText = model;

                    var score = $("#score");
                    var centered = PositionHelper.centreInCamera(camera, score.width(), score.height());

                    score.css('left', centered.left + 'px');
                    score.css('top', centered.top + "px");
                    score.show();
                };

                var statusIndicator = new Circle(scene.add, scene.remove, {
                    radius: 100,
                    segments: 80,
                    position: { x: 0, y: 0, z: -100}
                });
                register(statusIndicator);

                var waitingSound = new Howl({
                    urls: ['/game/audio/waiting.ogg', '/game/audio/waiting.mp3']
                });
                var goSound = new Howl({
                    urls: ['/game/audio/go.mp3']
                });

                var the_game_state = function (state) { return state.controller.state; };
                var the_score = function (state) { return state.controller.score; };

                tracker.onChangeTo(the_game_state, equals('ready'), show_instructions, statusIndicator);
                tracker.onChangeTo(the_game_state, equals('waiting'), hide_instructions, [statusIndicator, waitingSound]);
                tracker.onChangeTo(the_game_state, equals('challenge_started'), show_challenge, [statusIndicator, goSound, waitingSound]);
                tracker.onChangeTo(the_game_state, equals('complete'), show_results, statusIndicator);
                tracker.onChangeTo(the_game_state, equals('false_start'), show_false_start, [statusIndicator, goSound, waitingSound]);
                tracker.onChangeOf(the_score, update_score);
            }
        };
    }
};