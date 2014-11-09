"use strict";

module.exports = function(THREE) {
    var _ = require('lodash');
    var colour = require('color');
    var Circle = require('../../../inch/public/js/lib/ui/circle')(THREE);
    var Text = require('../../../inch/public/js/lib/text/orthographic')(THREE);

    return function(scene, ackLastRequest, positionHelper, permanent_effects, font_size, stateChanges) {
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

        var title = new Text(scene.add, scene.remove, {
            text: "CHALLENGE:RESPONSE",
            size: font_size(9),
            position: {
                x: positionHelper.ss.centre_x(),
                y: positionHelper.ss.centre_y(),
                z: 0
            },
            start_hidden: true
        });
        permanent_effects.push(title);

        var challenge = new Text(scene.add, scene.remove, {
            text: "GO!",
            size: font_size(20),
            position: {
                x: positionHelper.ss.centre_x(),
                y: positionHelper.ss.centre_y(),
                z: 0
            },
            start_hidden: true
        });
        permanent_effects.push(challenge);

        var score = new Text(scene.add, scene.remove, {
            text: "unset",
            size: font_size(10),
            position: {
                x: positionHelper.ss.centre_x(),
                y: positionHelper.ss.centre_y(),
                z: 0
            },
            start_hidden: true
        });
        permanent_effects.push(score);

        var false_start = new Text(scene.add, scene.remove, {
            text: "False Start",
            size: font_size(10),
            position: {
                x: positionHelper.ss.centre_x(),
                y: positionHelper.ss.gridNy(4, 1),
                z: 0
            },
            start_hidden: true
        });
        permanent_effects.push(false_start);

        var restart = new Text(scene.add, scene.remove, {
            text: "Press `R' to try again.",
            size: font_size(8),
            position: {
                x: positionHelper.ss.centre_x(),
                y: positionHelper.ss.gridNy(4, 3),
                z: 0
            },
            start_hidden: true
        });
        permanent_effects.push(restart);

        var statusIndicator = new Circle(scene.add, scene.remove, {
            radius: 100,
            segments: 32,
            position: {
                x: positionHelper.ss.centre_x(),
                y: positionHelper.ss.centre_y(),
                z: -100
            },
        });
        permanent_effects.push(statusIndicator);

        var the_game_state = function(state) { return state['controller']['state']; };
        var the_score = function(state) { return state['controller']['score']; };
    	
        stateChanges.on_property_changed_to(the_game_state, 'ready', show_instructions, [title, challenge, score, false_start, restart, statusIndicator]);
        stateChanges.on_property_changed_to(the_game_state, 'waiting', hide_instructions, [title, statusIndicator]);
        stateChanges.on_property_changed_to(the_game_state, 'challenge_started', show_challenge, [challenge, statusIndicator]);
        stateChanges.on_property_changed_to(the_game_state, 'complete', show_results, [challenge, score, restart, statusIndicator]);
        stateChanges.on_property_changed_to(the_game_state, 'false_start', show_false_start, [false_start, score, restart, statusIndicator]);
        stateChanges.on_property_change(the_score, update_score, score);
    };
};