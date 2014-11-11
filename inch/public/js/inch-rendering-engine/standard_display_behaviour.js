"use strict";

var $ = require("zepto-browserify").$;
var _ = require("lodash");
var io = require('socket.io-client');
var sequence = require('inch-sequence');
var InchScene = require('inch-scene');
var Howler = require('howler').Howler;
var numeral = require('numeral');

var keyboardController = require("./keyboard_controller");

var pendingAcknowledgements = require('./socket-pending_acknowledgements')();

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

    return function(config) {
        var dims = config.dimensions(config.ratio);
        config.level.screenResized(dims);

        var camera = config.camera(dims.usable_width, dims.usable_height);
        
        var threeJsScene = threeJsSupport.createScene(dims.usable_width, dims.usable_height);
        var inchScene = InchScene(threeJsScene);

        var renderer = threeJsSupport.createRenderer(dims.usable_width, dims.usable_height);
        threeJsSupport.attachRenderer(config.element, renderer);

        var registerEffect = function(effect) {
            effects.push(effect);
        };

        var setup = function(state) {
            stateChanges.update_state(state);
            
            config.level.setup(
                inchScene,
                pendingAcknowledgements.ackLast, 
                registerEffect, 
                stateChanges
            );

            if (stateChanges.value(stateChanges.is('paused'))) {
                require('./play-pause-behaviour').pause();
            }

            setupComplete = true;
        };

        var update = function(packet) {
            pendingAcknowledgements.add(packet.id);

            if (packet.id <= last_received_id) {
                return;
            }
            last_received_id = packet.id;

            stateChanges.update_state(packet.game_state);

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
                renderer.setSize(dims.usable_width, dims.usable_height);

                camera.aspect = dims.usable_width / dims.usable_height;
                camera.updateProjectionMatrix();

                config.level.screenResized(dims);
            },

            connect_to_server: function() {
                var socket = io.connect('/desktop');

                //TODO: the observer code should be in the observer only display behaviour
                var observer = false;
                if (window.document.hasFocus() && !observer) { 
                    socket.emit('unpause'); 
                }
                
                socket.on('disconnect', require('./connect-disconnect-behaviour').disconnected);
                socket.on('connect', require('./connect-disconnect-behaviour').connected);
                socket.on('game_state/setup', setup);
                socket.on('game_state/update', update);
                socket.on('error', function(data) { throw Error(data); });

                if (!config.display_config.controls.indexOf("keyboard") !== -1) {
                    keyboardController(socket, config.element, pendingAcknowledgements.flush);
                }
            }
        };
    };
};