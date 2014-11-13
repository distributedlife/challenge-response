"use strict";

module.exports = function(THREE) {
    var _ = require('lodash');
    var $ = require('zepto-browserify').$;
    var Howler = require('howler').Howler;
    var colour = require('color');
    var Circle = require('inch-geometry2d-circle')(THREE);
    var GlText = require('inch-geometry2d-gltext')(THREE);
    var PositionHelper = require("inch-position2d-helper");
    var equals = require("inch-state-tracker").Equals;

    return {
        screenResized: function(dimensions) {
            PositionHelper.updateScreenDims(dimensions.screenWidth, dimensions.screenHeight, dimensions.orientation, dimensions.margin);
        },
        setup: function(scene, ackLastRequest, register, tracker) {
            var show_instructions = function(model, prior_model, title, challenge, score, false_start, restart, statusIndicator) {
                title.fadeIn();
                challenge.fadeOut();
                score.fadeOut();
                false_start.fadeOut();
                restart.fadeOut();
                statusIndicator.changeColour(0, colour("grey").rgbArray());
            };

            var hide_instructions = function(model, prior_model, title, statusIndicator) {
                title.fadeOut(0.25);
                statusIndicator.changeColour(0, colour("red").rgbArray());
            };

            var show_challenge = function(model, prior_model, challenge, statusIndicator) {
                challenge.fadeIn();
                ackLastRequest('show-challenge');
                statusIndicator.changeColour(0, colour("green").rgbArray());
            };

            var show_results = function(model, prior_model, challenge, score, restart, statusIndicator) {
                challenge.fadeOut();
                score.fadeIn();
                restart.fadeIn();
                statusIndicator.changeColour(0, colour("black").rgbArray());
            };

            var show_false_start = function(model, prior_model, false_start, score, restart, statusIndicator) {
                false_start.fadeIn();
                restart.fadeIn();
                statusIndicator.changeColour(0, colour("orange").rgbArray());
            }

            var update_score = function(model, prior_model, score) {
                score.updateText(model + "ms");
            }

            var title = new GlText(scene.add, scene.remove, {
                text: "CHALLENGE:RESPONSE",
                size: 9,
                position: {
                    x: PositionHelper.ss.centreX(),
                    y: PositionHelper.ss.centreY(),
                    z: 0
                },
                start_hidden: true
            });
            register(title);

            var challenge = new GlText(scene.add, scene.remove, {
                text: "GO!",
                size: 20,
                position: {
                    x: PositionHelper.ss.centreX(),
                    y: PositionHelper.ss.centreY(),
                    z: 0
                },
                start_hidden: true
            });
            register(challenge);

            var score = new GlText(scene.add, scene.remove, {
                text: "unset",
                size: 10,
                position: {
                    x: PositionHelper.ss.centreX(),
                    y: PositionHelper.ss.centreY(),
                    z: 0
                },
                start_hidden: true
            });
            register(score);

            var false_start = new GlText(scene.add, scene.remove, {
                text: "False Start",
                size: 10,
                position: {
                    x: PositionHelper.ss.centreX(),
                    y: PositionHelper.ss.gridNy(4, 1),
                    z: 0
                },
                start_hidden: true
            });
            register(false_start);

            var restart = new GlText(scene.add, scene.remove, {
                text: "Press `R' to try again.",
                size: 8,
                position: {
                    x: PositionHelper.ss.centreX(),
                    y: PositionHelper.ss.gridNy(4, 3),
                    z: 0
                },
                start_hidden: true
            });
            register(restart);

            var statusIndicator = new Circle(scene.add, scene.remove, {
                radius: 100,
                segments: 32,
                position: {
                    x: PositionHelper.ss.centreX(),
                    y: PositionHelper.ss.centreY(),
                    z: -100
                },
            });
            register(statusIndicator);

            var the_game_state = function(state) { return state['controller']['state']; };
            var the_score = function(state) { return state['controller']['score']; };

            tracker.onChangeTo(the_game_state, equals('ready'), show_instructions, [title, challenge, score, false_start, restart, statusIndicator]);
            tracker.onChangeTo(the_game_state, equals('waiting'), hide_instructions, [title, statusIndicator]);
            tracker.onChangeTo(the_game_state, equals('challenge_started'), show_challenge, [challenge, statusIndicator]);
            tracker.onChangeTo(the_game_state, equals('complete'), show_results, [challenge, score, restart, statusIndicator]);
            tracker.onChangeTo(the_game_state, equals('false_start'), show_false_start, [false_start, score, restart, statusIndicator]);
            tracker.onChangeOf(the_score, update_score, score);
        }
    };
};