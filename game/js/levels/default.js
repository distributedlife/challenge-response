var _ = require('lodash');
var colour = require('color');
var circle = require('../../../inch/public/js/inch-2d-geometry-support').circle;
var text = require('../../../inch/public/js/inch-2d-geometry-support').text;
// var circle = require('inch-geometry-support').circle;
// var text = require('inch-geometry-support').text;

"use strict";

module.exports = function(scene, ackLastRequest, positionHelper, permanent_effects, font_size, stateChanges) {
    var show_instructions = function(model, prior_model, title, challenge, score, false_start, restart, status_indicator) {
        title.fade_in();
        challenge.fade_out();
        score.fade_out();
        false_start.fade_out();
        restart.fade_out();
        status_indicator.change_colour(0, colour("grey").rgbArray());
    };

    var hide_instructions = function(model, prior_model, title, status_indicator) {
        title.fade_out(0.25);
        status_indicator.change_colour(0, colour("red").rgbArray());
    };

    var show_challenge = function(model, prior_model, challenge, status_indicator) {
        challenge.fade_in();
        ackLastRequest('show-challenge');   
        status_indicator.change_colour(0, colour("green").rgbArray());
    };

    var show_results = function(model, prior_model, challenge, score, restart, status_indicator) {
        challenge.fade_out();
        score.fade_in();
        restart.fade_in();
        status_indicator.change_colour(0, colour("black").rgbArray());
    };

    var show_false_start = function(model, prior_model, false_start, score, restart, status_indicator) {
        false_start.fade_in();
        restart.fade_in();
        status_indicator.change_colour(0, colour("orange").rgbArray());
    }

    var update_score = function(model, prior_model, score) {
        score.update_text(model + "ms");
    }

    var title = new text(scene.add, scene.remove, {
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

    var challenge = new text(scene.add, scene.remove, {
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

    var score = new text(scene.add, scene.remove, {
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

    var false_start = new text(scene.add, scene.remove, {
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

    var restart = new text(scene.add, scene.remove, {
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

    var status_indicator = new circle(scene.add, scene.remove, {
        radius: 100,
        segments: 32,
        position: {
            x: positionHelper.ss.centre_x(),
            y: positionHelper.ss.centre_y(),
            z: -100
        },
    });
    permanent_effects.push(status_indicator);

    var the_game_state = function(state) { return state['controller']['state']; };
    var the_score = function(state) { return state['controller']['score']; };
	
    stateChanges.on_property_changed_to(the_game_state, 'ready', show_instructions, [title, challenge, score, false_start, restart, status_indicator]);
    stateChanges.on_property_changed_to(the_game_state, 'waiting', hide_instructions, [title, status_indicator]);
    stateChanges.on_property_changed_to(the_game_state, 'challenge_started', show_challenge, [challenge, status_indicator]);
    stateChanges.on_property_changed_to(the_game_state, 'complete', show_results, [challenge, score, restart, status_indicator]);
    stateChanges.on_property_changed_to(the_game_state, 'false_start', show_false_start, [false_start, score, restart, status_indicator]);
    stateChanges.on_property_change(the_score, update_score, score);
};