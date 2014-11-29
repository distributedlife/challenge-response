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
            setup: function (scene, ackLastRequest, register, tracker, camera) {
                //TODO: should we allow the passing of the camera in?
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
                    $("#score")[0].innerText = model;


                    //TODO: pull this into positionHelper and reference: http://zachberry.com/blog/tracking-3d-objects-in-2d-with-three-js/
                    var dims = Dimensions.Dimensions();
                    var visibleWidth, visibleHeight, p, percX, percY, left, top;

                    visibleWidth = camera.right - camera.left;
                    visibleHeight = camera.top - camera.bottom;

                    // TODO: this is a param (centre of object in scene)
                    p = {x: 0, y: 0, z: 0};

                    // determine where in the visible area the sphere is,
                    // with percX=0 meaning the left edge and 1 meaning the right
                    // and percY=0 meaning top and 1 meaning bottom
                    percX = (p.x - camera.left) / visibleWidth;
                    percY = 1 - ((p.y - camera.bottom) / visibleHeight);

                    // scale these values to our viewport size
                    left = percX * dims.usableWidth;
                    top = percY * dims.usableHeight;

                    var score = $("#score");

                    //TODO: replace with dims changes
                    // var marginWidth = Math.round(dims.screenWidth - dims.usableWidth) / 2;
                    // var marginHeight = Math.round(dims.screenHeight - dims.usableHeight) / 2;

                    score.css('left', (left - score.width() / 2) + dims.marginSides + 'px');
                    score.css('top', (top - score.height() / 2) + dims.marginTopBottom + 'px');
                    score.show();
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