//TODO: the fonts should be loaded in some other way –perhaps in a fonts file (like entities)
define(["lodash", "lib/ui/orthographic", "lib/text/orthographic", 'font/helvetiker_regular'], function(_, orthographic_display, text, helvetiker_regular) {
    "use strict";

    return function(element, width, height, options) {
        var start = undefined;
        var finished = false;

        var score = undefined;

        var show_instructions = function(model, prior_model, title) {
            start = undefined;
            title.fade_in(0, 1.0);
        };

        var hide_instructions = function(model, prior_model, title) {
            title.fade_out(0.25);
        };

        var show_challenge = function(model, prior_model, challenge, score) {
            start = Date.now();
            challenge.fade_in(0.25, 1.0);
            level.acknowledge('show-challenge');   

            score.fade_in(0, 1.0);
        };

        var acknowledge_response = function(model, prior_model, challenge, acknowledgment, score) {
            finished = true;
            challenge.fade_out(0);
            acknowledgment.fade_in(0.25, 1.0);
            score.fade_out(0);  
        };

        var show_results = function(model, prior_model, acknowledgment, score) {
            acknowledgment.fade_out(0.25);
            score.update_text(model.score + "ms");
            score.fade_in(0, 1.0);
        };

        var show_false_start = function(model, prior_model, false_start, score) {
            false_start.fade_in(0, 1.0);
            score.update_text(model.score + "ms");
            score.fade_in(0, 1.0);  
        }

        var screen_width = function() { return level.width; };
        var screen_height = function() { return level.height; };
        var game_width = function() { level.width * level.width / level.the('dimensions').width; };
        var game_height = function() { level.height * level.height / level.the('dimensions').height; };

        var position_helpers = function() {
            var div = function(dim, slices) {
                return function(p) {
                    return dim * (p / slices);
                }
            };

            var build_coordinate_helpers = function(width, height) {
                return {
                    left: function() {
                        return div(width(), 2)(0);
                    },
                    centre_x: function() {
                        return div(width(), 2)(1);
                    },
                    right: function() {
                        return div(width(), 2)(2);
                    },
                    gridNx: function(n, p) {
                        return div(width(), n)(p);
                    },
                    top: function() {
                        return div(height(), 2)(0);
                    },
                    centre_y: function() {
                        return div(height(), 2)(1);
                    },
                    bottom: function() {
                        return div(height(), 2)(2);
                    },
                    gridNy: function(n, p) {
                        return div(height(), n)(p);
                    }
                }
            };

            return {
                screen_space_coordinates: build_coordinate_helpers(screen_width, screen_height),
                game_space_coordinates: build_coordinate_helpers(game_width, game_height)
            };
        };

        var setup = function() {
            var title = new text("CHALLENGE:RESPONSE", level.scene_manager().add, level.scene_manager().remove, {
                size: 80,
                position: {
                    x: position_helpers().screen_space_coordinates.centre_x(),
                    y: position_helpers().screen_space_coordinates.gridNy(4, 1),
                    z: 0
                },
                start_hidden: true
            });
            level.permanent_effects.push(title);

            var challenge = new text("GO!", level.scene_manager().add, level.scene_manager().remove, {
                size: 80,
                position: {
                    x: position_helpers().screen_space_coordinates.centre_x(),
                    y: position_helpers().screen_space_coordinates.centre_y(),
                    z: 0
                },
                start_hidden: true
            });
            level.permanent_effects.push(challenge);

            var acknowledgment = new text("Got it!", level.scene_manager().add, level.scene_manager().remove, {
                size: 80,
                position: {
                    x: position_helpers().screen_space_coordinates.centre_x(),
                    y: position_helpers().screen_space_coordinates.centre_y(),
                    z: 0
                },
                start_hidden: true
            });
            level.permanent_effects.push(acknowledgment);

            score = new text("unset", level.scene_manager().add, level.scene_manager().remove, {
                size: 160,
                position: {
                    x: position_helpers().screen_space_coordinates.centre_x(),
                    y: position_helpers().screen_space_coordinates.centre_y(),
                    z: 0
                },
                start_hidden: true
            });
            level.permanent_effects.push(score);

            var false_start = new text("False Start", level.scene_manager().add, level.scene_manager().remove, {
                size: 80,
                position: {
                    x: position_helpers().screen_space_coordinates.centre_x(),
                    y: position_helpers().screen_space_coordinates.gridNy(4, 1),
                    z: 0
                },
                start_hidden: true
            });
            level.permanent_effects.push(acknowledgment);
        	
            level.on_property_changed_to(level.the('controller'), level.property('state'), level.equals('ready'), show_instructions, title);
            level.on_property_changed_to(level.the('controller'), level.property('state'), level.equals('waiting'), hide_instructions, title);
            level.on_property_changed_to(level.the('controller'), level.property('state'), level.equals('challenge_started'), show_challenge, [challenge, score]);
            level.on_property_changed_to(level.the('controller'), level.property('state'), level.equals('response_accepted'), acknowledge_response, [challenge, acknowledgment, score]);
            level.on_property_changed_to(level.the('controller'), level.property('state'), level.equals('complete'), show_results, [acknowledgment, score]);
            level.on_property_changed_to(level.the('controller'), level.property('state'), level.equals('false_start'), show_false_start, [false_start, score]);

            if (level.value(level.the('controller')).state === 'ready') {
                show_instructions(undefined, undefined, title);
            }
        };

        var update = function() {
            if (start !== undefined && !finished) {
                console.log(Date.now() - start)
                score.update_text(Date.now() - start + "ms");
            }
        };

        var level = Object.create(orthographic_display(element, width, height, options, setup, update));

        return level;
    };
});
