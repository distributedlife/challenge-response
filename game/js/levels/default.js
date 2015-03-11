"use strict";

module.exports = {
    deps: ["RenderEngineAdapter", "PositionHelper"],
    type: "Level",
    func: function (adapter, PositionHelper) {
        var colour = require('color');
        var equals = require("../../../plugins/inch-state-tracker/src/tracker.js").Equals;
        var Circle = require('../../../plugins/inch-geometry2d-circle/src/circle.js')(adapter());
        var Howl = require('howler').Howl;
        var $ = require('zepto-browserify').$;
        var _ = require('lodash');

        var mainTemplate = require("../../jade/practice.jade");
        var priorScoresTemplate = require("../../jade/priorScores.jade");

        return {
            screenResized: function () {
                //TODO: do we need to reposition all the things?
            },
            setup: function (scene, ackLastRequest, register, tracker, camera) {
                $("#overlay").append(mainTemplate());

                var showInstructions = function (model, priorModel, statusIndicator) {
                    $("#instructions").show();
                    $("#challenge").hide();
                    $("#results").hide();
                    $("#falsestart").hide();
                    statusIndicator.changeColour(0, colour("grey").rgbArray());
                };

                var hideInstructions = function (model, priorModel, statusIndicator, waitingSound) {
                    $("#instructions").hide();
                    statusIndicator.changeColour(0, colour("red").rgbArray());
                    waitingSound.play();
                };

                var showChallenge = function (model, priorModel, statusIndicator, goSound, waitingSound) {
                    waitingSound.stop();
                    goSound.play();

                    $("#challenge").show();
                    ackLastRequest('show-challenge');
                    statusIndicator.changeColour(0, colour("green").rgbArray());
                };

                var showResults = function (model, priorModel, statusIndicator) {
                    $("#challenge").hide();
                    $("#results").show();
                    statusIndicator.changeColour(0, colour("black").rgbArray());
                };

                var showFalseStart = function (model, priorModel, statusIndicator, goSound, waitingSound) {
                    $("#falsestart").show();
                    statusIndicator.changeColour(0, colour("orange").rgbArray());
                    goSound.stop();
                    waitingSound.stop();
                };

                var updateScore = function (model) {
                    $("#score")[0].innerText = model;

                    var score = $("#score");
                    var centered = PositionHelper().centreInCamera(camera, score.width(), score.height());

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
                    return function (currentValue) {
                        $("#prior-scores").append(priorScoresTemplate({id: "prior-score-" + currentValue.id, score: currentValue.score}));
                    };
                };
                var updateHightlight = function(currentValue) {
                    if (currentValue.best) {
                        $("#prior-score-" + currentValue.id).addClass("best");
                    } else {
                        $("#prior-score-" + currentValue.id).removeClass("best");
                    }
                };
                var addExistingScoresFunction = function() {
                    return function (currrentValues) {
                        _.each(currrentValues, function(value) {
                            $("#prior-scores").append(priorScoresTemplate({id: "prior-score-" + value.id, score: value.score}));
                        });
                    };
                };

                var theGameState = function (state) { return state.controller.state; };
                var theScore = function (state) { return state.controller.score; };
                var thePriorScores = function (state) { return state.controller.priorScores; };

                tracker.onChangeTo(theGameState, equals('ready'), showInstructions, statusIndicator);
                tracker.onChangeTo(theGameState, equals('waiting'), hideInstructions, [statusIndicator, waitingSound]);
                tracker.onChangeTo(theGameState, equals('challengeStarted'), showChallenge, [statusIndicator, goSound, waitingSound]);
                tracker.onChangeTo(theGameState, equals('complete'), showResults, statusIndicator);
                tracker.onChangeTo(theGameState, equals('falseStart'), showFalseStart, [statusIndicator, goSound, waitingSound]);
                tracker.onChangeOf(theScore, updateScore);
                tracker.onElementAdded(thePriorScores, onScoreAddedFunction(), addExistingScoresFunction());
                tracker.onElementChanged(thePriorScores, updateHightlight);
            }
        };
    }
};