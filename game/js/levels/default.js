"use strict";

module.exports = {
    deps: ["RenderEngineAdapter", "PositionHelper", "Camera", "Element"],
    type: "Level",
    func: function (adapter, PositionHelper, Camera, element) {
        var colour = require('color');
        var equals = require("../../../plugins/inch-state-tracker/src/tracker.js").Equals;
        var Howl = require('howler').Howl;
        var $ = require('zepto-browserify').$;
        var _ = require('lodash');
        var define = require('../../../plugins/inch-define-plugin/src/define.js');

        var mainTemplate = require("../../jade/practice.jade");
        var priorScoresTemplate = require("../../jade/priorScores.jade");

        var camera;
        var renderer;
        var scene;
        return {
            screenResized: function (dims) {
                if (renderer) {
                    renderer.setSize(dims.usableWidth, dims.usableHeight);
                }

                if (camera) {
                    //TODO: can we use dims.ratio?
                    adapter().setCameraAspectRatio(camera, dims.usableWidth / dims.usableHeight);

                    //TODO: move this technical detail into the adapter
                    adapter().updateProjectionMatrix(camera);
                }
            },
            update: function(dt) {
                if (renderer) {
                    renderer.render(scene.scene(), camera);
                }
            },
            setup: function (unused1, ackLastRequest, register, tracker) {
                var Circle = require('../../../three-js-dep/inch-geometry2d-circle/src/circle.js')(adapter());

                $("#overlay").append(mainTemplate());


                //Render layer concern
                //Setup threejs-camera, inch-scene, threejs-scene, threejs-renderer
                camera = Camera().Camera();
                scene = require('../../../three-js-dep/inch-scene/src/scene.js')(adapter().createScene());
                renderer = adapter().createRenderer();
                adapter().attachRenderer(element(), renderer);



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