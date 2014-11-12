"use strict";

var $ = require("zepto-browserify").$;
var _ = require("lodash");
var InchScene = require('inch-scene');
var numeral = require('numeral');

module.exports = function(THREE) {
    var threeJsSupport = require('./threeJsSupport')(THREE);

    var effects = [];
    var prior_step = Date.now();
    var last_received_id = 0;
    var stateChanges = require("./track_state_changes");
    
    var value = stateChanges;
    var when = stateChanges;
    stateChanges.of = stateChanges.value;
    var property = stateChanges.the;

    var setupComplete = false;

    require("./inch-enable-fullscreen")();
    require("./inch-extra-toggle-sound")();

    return function(config, ackLast, addAck) {
        var dims = config.dimensions(config.ratio);
        config.level.screenResized(dims);

        var camera = config.camera(dims.usableWidth, dims.usableHeight);
        
        var threeJsScene = threeJsSupport.createScene(dims.usableWidth, dims.usableHeight);
        var inchScene = InchScene(threeJsScene);

        var renderer = threeJsSupport.createRenderer(dims.usableWidth, dims.usableHeight);
        threeJsSupport.attachRenderer(config.element, renderer);

        var registerEffect = function(effect) {
            effects.push(effect);
        };

        var setup = function(state) {
            stateChanges.update_state(state);
            
            config.level.setup(
                inchScene,
                ackLast, 
                registerEffect, 
                stateChanges
            );

            // if (value.of('paused').is(true)) {}
            if (value.of(stateChanges.is('paused'))) {
                require('./play-pause-behaviour').pause();
            }

            setupComplete = true;
        };

        var update = function(packet) {
            addAck(packet.id);

            if (packet.id <= last_received_id) {
                return;
            }
            last_received_id = packet.id;

            stateChanges.update_state(packet.game_state);

            //if (value.of('paused').hasChanged() && value.of('paused').is('true')) {
            if (when.changed(property('paused')) && value.of(stateChanges.is('paused'))) { 
                require('./play-pause-behaviour').pause(); 
            }
            if (when.changed(property('paused')) && value.of(stateChanges.isnt('paused'))) { 
                require('./play-pause-behaviour').resume(); 
            }

            if (when.changed(property('players'))) {  
                $('#player-count').text(numeral(value.of(property('players'))).format('0a'));
            }
            if (when.changed(property('observers'))) {  
                $('#observer-count').text(numeral(value.of(property('observers'))).format('0a'));  
            }

            stateChanges.detect_changes_and_notify_observers();
        };

        return {
            setup: setup,
            update: update,
            updateDisplay: function() {
                if (value.of(stateChanges.is('paused'))) {
                    prior_step = Date.now();
                    return;
                }

                //TODO: move this into update loop
                var now = Date.now();

                var dt = (now - prior_step) / 1000;
                prior_step = Date.now();

                renderer.render(inchScene.scene(), camera); 

                if (!setupComplete) {
                    return;
                }

                _.each(effects, function(effect) { 
                    effect.tick(dt); 
                });

                effects = _.reject(effects, function(effect) { return !effect.isAlive(); });
            },

            resize: function(dims) {
                renderer.setSize(dims.usableWidth, dims.usableHeight);

                camera.aspect = dims.usableWidth / dims.usableHeight;
                camera.updateProjectionMatrix();

                config.level.screenResized(dims);
            }
        };
    };
};