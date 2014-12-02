"use strict";

module.exports = {
    deps: ["RenderEngineAdapter", "Window", "Dimensions", "PositionHelper"],
    type: "Level",
    func: function (adapter, window, Dimensions, PositionHelper) {
        var colour = require('color');
        var equals = require("inch-state-tracker").Equals;
        var Circle = require('inch-geometry2d-circle')(adapter);
        var Howl = require('howler').Howl;
        var jade = require('jade');
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
                    urls: ['/game/audio/waiting.mp3']
                });
                var goSound = new Howl({
                    urls: ['/game/audio/go.mp3']
                });

                var onScoreAddedFunction = function() {
                    var template;
                    $.get('/game/jade/priorScores.jade', function (data) {
                        template = data;
                    });

                    return function (currentValue, priorValue) {
                        $("#prior-scores").append(jade.render(template, {score: currentValue.score}));
                    };
                };

                var theGameState = function (state) { return state.controller.state; };
                var theScore = function (state) { return state.controller.score; };
                var thePriorScores = function (state) { return state.controller.priorScores; };

                tracker.onChangeTo(theGameState, equals('ready'), show_instructions, statusIndicator);
                tracker.onChangeTo(theGameState, equals('waiting'), hide_instructions, [statusIndicator, waitingSound]);
                tracker.onChangeTo(theGameState, equals('challenge_started'), show_challenge, [statusIndicator, goSound, waitingSound]);
                tracker.onChangeTo(theGameState, equals('complete'), show_results, statusIndicator);
                tracker.onChangeTo(theGameState, equals('false_start'), show_false_start, [statusIndicator, goSound, waitingSound]);
                tracker.onChangeOf(theScore, update_score);
                tracker.onElementAdded(thePriorScores, onScoreAddedFunction());
            }
        };
    }
};