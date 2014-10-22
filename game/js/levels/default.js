define(["lodash", "lib/ui/orthographic", "lib/text/orthographic", 'font/helvetiker_regular'], function(_, orthographic_display, text, helvetiker_regular) {
    "use strict";

    return function(element, width, height, options) {
        var show_instructions = function(model, prior_model, title) {
            title.fade_in(0, 1.0);
        };

        var hide_instructions = function(model, prior_model, title) {
            title.fade_out(0.25);
        };

        var show_challenge = function(model, prior_model, challenge) {
            challenge.fade_in(0.25, 1.0);
        };

        var acknowledge_response = function(model, prior_model, challenge, acknowledgment) {
            challenge.fade_out(0);
            acknowledgment.fade_in(0.25, 1.0);
        };

        var show_results = function(model, prior_model, acknowledgment, score) {
            acknowledgment.fade_out(0.25);
            score.update_text(model.score + "ms");
            score.fade_in(0, 1.0);
        };

        var position_helpers = function() {
            var width = function() {
                return level.value(level.screen_width);
            };
            var height = function() {
                return level.value(level.screen_height);
            };

            var div = function(dim, slices) {
                return function(p) {
                    return dim * (p / slices);
                }
            }

            return {
                centre_centre: {
                    x: width() * 0.5,
                    y: height() * 0.5,
                    z: 0
                },
                width: {
                    centre: width() * 0.5,
                },
                height: {
                    top: height() * 0,
                    centre: height() * 0.5,
                    bottom: height() * 1,
                    div4: div(height(), 4)
                }
            }
        };

        var setup = function() {
            var title = new text("CHALLENGE:RESPONSE", level.scene_manager().add, level.scene_manager().remove, {
                size: 40,
                position: {
                    x: position_helpers().width.centre,
                    y: position_helpers().height.div4(1),
                    z: 0
                },
                start_hidden: true
            });
            level.permanent_effects.push(title);

            var challenge = new text("GO!", level.scene_manager().add, level.scene_manager().remove, {
                size: 80,
                position: position_helpers().centre_centre,
                start_hidden: true
            });
            level.permanent_effects.push(challenge);

            var acknowledgment = new text("Got it!", level.scene_manager().add, level.scene_manager().remove, {
                size: 80,
                position: position_helpers().centre_centre,
                start_hidden: true
            });
            level.permanent_effects.push(acknowledgment);

            var score = new text("unset", level.scene_manager().add, level.scene_manager().remove, {
                size: 80,
                position: position_helpers().centre_centre,
                start_hidden: true
            });
            level.permanent_effects.push(score);
        	
            level.on_property_changed_to(level.the('controller'), level.property('state'), level.equals('a'), show_instructions, title);
            level.on_property_changed_to(level.the('controller'), level.property('state'), level.equals('b'), hide_instructions, title);
            level.on_property_changed_to(level.the('controller'), level.property('state'), level.equals('c'), show_challenge, challenge);
            level.on_property_changed_to(level.the('controller'), level.property('state'), level.equals('d'), acknowledge_response, [challenge, acknowledgment]);
            level.on_property_changed_to(level.the('controller'), level.property('state'), level.equals('e'), show_results, [acknowledgment, score]);

            if (level.value(level.the('controller')).state === 'a') {
                show_instructions(undefined, undefined, title);
            }
        };

        var update = function() {};

        var level = Object.create(orthographic_display(element, width, height, options, setup, update));

        return level;
    };
});
