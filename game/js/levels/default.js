define(["lodash", "lib/ui/orthographic", "lib/text/orthographic", 'font/helvetiker_regular', "lib/ui/circle", "lib/ui/colours", "lib/ui/position_helper"], function(_, orthographic_display, text, helvetiker_regular, circle, colours, position_helper) {
    "use strict";

    return function(element, initial_width, initial_height, options) {
        var show_instructions = function(model, prior_model, title, challenge, challenge_effect, score, false_start, restart, status_indicator) {
            title.fade_in();
            challenge.fade_out();
            challenge_effect.fade_out();
            score.fade_out();
            false_start.fade_out();
            restart.fade_out();
            status_indicator.change_colour(0, colours.grey50.rgba());
        };

        var hide_instructions = function(model, prior_model, title, status_indicator) {
            title.fade_out(0.25);
            status_indicator.change_colour(0, colours.red.rgba());
        };

        var show_challenge = function(model, prior_model, challenge, challenge_effect, status_indicator) {
            challenge.fade_in();
            level.acknowledge('show-challenge');   
            status_indicator.change_colour(0, colours.green1.rgba());
            // challenge_effect.transition_colour(0.5, colours.white.rgba(), colours.transparent(colours.white.rgba()));
            // challenge_effect.fade_in();
            // challenge_effect.scale(0.5, 1, 5);
        };

        var show_results = function(model, prior_model, challenge, score, restart, status_indicator) {
            challenge.fade_out();
            score.fade_in();
            restart.fade_in();
            status_indicator.change_colour(0, colours.black.rgba());
        };

        var show_false_start = function(model, prior_model, false_start, score, restart, status_indicator) {
            false_start.fade_in();
            restart.fade_in();
            status_indicator.change_colour(0, colours.orange.rgba());
        }

        var update_score = function(model, prior_model, score) {
            score.update_text(model + "ms");
        }

        var setup = function() {
            var title = new text(level.scene_manager().add, level.scene_manager().remove, {
                text: "CHALLENGE:RESPONSE",
                size: level.font_size(9),
                position: {
                    x: level.position_helper.ss.centre_x(),
                    y: level.position_helper.ss.centre_y(),
                    z: 0
                },
                start_hidden: true
            });
            level.permanent_effects.push(title);

            var challenge = new text(level.scene_manager().add, level.scene_manager().remove, {
                text: "GO!",
                size: level.font_size(20),
                position: {
                    x: level.position_helper.ss.centre_x(),
                    y: level.position_helper.ss.centre_y(),
                    z: 0
                },
                start_hidden: true
            });
            level.permanent_effects.push(challenge);

            var challenge_effect = new text(level.scene_manager().add, level.scene_manager().remove, {
                text: "GO!",
                size: level.font_size(20),
                position: {
                    x: level.position_helper.ss.centre_x(),
                    y: level.position_helper.ss.centre_y(),
                    z: 0
                },
                start_hidden: true
            });
            level.permanent_effects.push(challenge_effect);

            var score = new text(level.scene_manager().add, level.scene_manager().remove, {
                text: "unset",
                size: level.font_size(10),
                position: {
                    x: level.position_helper.ss.centre_x(),
                    y: level.position_helper.ss.centre_y(),
                    z: 0
                },
                start_hidden: true
            });
            level.permanent_effects.push(score);

            var false_start = new text(level.scene_manager().add, level.scene_manager().remove, {
                text: "False Start",
                size: level.font_size(10),
                position: {
                    x: level.position_helper.ss.centre_x(),
                    y: level.position_helper.ss.gridNy(4, 1),
                    z: 0
                },
                start_hidden: true
            });
            level.permanent_effects.push(false_start);

            var restart = new text(level.scene_manager().add, level.scene_manager().remove, {
                text: "Press `R' to try again.",
                size: level.font_size(8),
                position: {
                    x: level.position_helper.ss.centre_x(),
                    y: level.position_helper.ss.gridNy(4, 3),
                    z: 0
                },
                start_hidden: true
            });
            level.permanent_effects.push(restart);

            var status_indicator = new circle(level.scene_manager().add, level.scene_manager().remove, {
                radius: 100,
                segments: 32,
                position: {
                    x: level.position_helper.ss.centre_x(),
                    y: level.position_helper.ss.gridNy(4,0),
                    z: -100
                },
            });
            level.permanent_effects.push(status_indicator);

            var the_game_state = function(state) { return state['controller']['state']; };
            var the_score = function(state) { return state['controller']['score']; };
        	
            level.on_property_changed_to(the_game_state, 'ready', show_instructions, [title, challenge, challenge_effect, score, false_start, restart, status_indicator]);
            level.on_property_changed_to(the_game_state, 'waiting', hide_instructions, [title, status_indicator]);
            level.on_property_changed_to(the_game_state, 'challenge_started', show_challenge, [challenge, challenge_effect, status_indicator]);
            level.on_property_changed_to(the_game_state, 'complete', show_results, [challenge, score, restart, status_indicator]);
            level.on_property_changed_to(the_game_state, 'false_start', show_false_start, [false_start, score, restart, status_indicator]);
            level.on_property_change(the_score, update_score, score);
        };

        var level = Object.create(orthographic_display(element, initial_width, initial_height, options, setup));
        return level;
    };
});
