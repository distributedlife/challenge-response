"use strict";

var $ = require("zepto-browserify").$;
var _ = require("lodash");
var io = require('socket.io-client');
var screenfull = require("screenfull");
var keyboard_controller = require("./keyboard_controller");
var SoundManager = require("./sound_manager");
var stats = require("./stats");
var format = require('./text_format');
var sequence = require('inch-sequence');
var PositionHelper = require("../lib/ui/position_helper");
var InchScene = require('inch-scene');
var pendingAcknowledgements = require('../pending_acknowledgements');
var threeJsSupport = require('./threeJsSupport');

var last_received_id = 0;
var sound_manager = new SoundManager();

module.exports = function(element, initial_width, initial_height, options, setup_func, camera_func) {
    var camera = camera_func(initial_width, initial_height);
    var threeJsScene = threeJsSupport.create_scene(initial_width, initial_height);
    var renderer = threeJsSupport.create_and_attach_renderer(element, initial_width, initial_height);

    var inchScene = InchScene(threeJsScene);

    var display = {};
    var setup_complete = false;
    var stateChanges = require("./track_state_changes");
    var position_helper = PositionHelper(initial_width, initial_height, initial_width, initial_height);
    var prior_step = Date.now();
    var temporary_effects = [];
    var permanent_effects = [];
    var changes = [];
    var ratio = 1.0;

    var font_size = function(size) {
        return size * ratio;
    };

    var tick = function(dt) {
        _.each(permanent_effects, function(permanent_effect) { permanent_effect.tick(dt); });
        _.each(temporary_effects, function(temporary_effect) { temporary_effect.tick(dt); });

        var expired_effects = _.select(temporary_effects, function(temporary_effect) { return !temporary_effect.is_alive(); });
        temporary_effects = _.reject(temporary_effects, function(temporary_effect) { return !temporary_effect.is_alive(); });

        _.each(expired_effects, function(expired_effect) {  inchScene.remove(expired_effect.mesh); });
    };

    var pause = function() { 
        $('.paused').show(); $('#paused').show();
        sound_manager.pauseAll();
    };
    var resume = function() { 
        $('.paused').hide(); $('#paused').hide(); 
        sound_manager.resumeAll();
    };
    var disconnected = function() { 
        $('.disconnected').show(); 
    };
    var connected = function() { 
        $('.disconnected').hide(); 
    };

    var setup = function(state) {
        stateChanges.update_state(state);
        setup_func(
            inchScene,
            pendingAcknowledgements.ackLast.bind(pendingAcknowledgements), 
            position_helper, 
            permanent_effects, 
            font_size, 
            stateChanges
        );

        if (stateChanges.value(stateChanges.is('paused'))) {
            sound_manager.pauseAll();
        }
        // console.log(state.dimensions.width, state.dimensions.height)
        position_helper.update_level_dims(state.dimensions.width, state.dimensions.height);

        setup_complete = true;
    };

    var update = function(packet) {
        stats( 'update-inch' ).start();

        pendingAcknowledgements.add(packet.id);

        if (packet.id <= last_received_id) {
            return;
        }
        last_received_id = packet.id;

        stateChanges.update_state(packet.game_state);

        //TODO: fix this with the match board size to screen size
        // if (this.changed(this.the('dimensions'))) {
        //  this.resize(this.width, this.height); 
        // }

        if (stateChanges.changed(stateChanges.the('paused')) && stateChanges.value(stateChanges.is('paused'))) { 
            pause(); 
        }
        if (stateChanges.changed(stateChanges.the('paused')) && stateChanges.value(stateChanges.isnt('paused'))) { 
            resume(); 
        }

        if (stateChanges.changed(stateChanges.the('players'))) {  
            $('#player-count').text(format.number_to_3_chars(stateChanges.value(stateChanges.the('players'))));  
        }
        if (stateChanges.changed(stateChanges.the('observers'))) {  
            $('#observer-count').text(format.number_to_3_chars(stateChanges.value(stateChanges.the('observers'))));  
        }

        stateChanges.detect_changes_and_notify_observers();
        stats( 'update-inch' ).end();
    };

    _.extend(display, {
        //called by renderer      
        update_display: function() {
            if (stateChanges.value(stateChanges.is('paused'))) {
                prior_step = Date.now();
                return;
            }

            var now = Date.now();

            var dt = (now - prior_step) / 1000;
            prior_step = Date.now();

            renderer.render(inchScene.scene(), camera); 

            if (setup_complete) {
                tick(dt); 
            }
        },

        //window-event callback
        resize: function(dims) {
            position_helper.update_screen_dims(dims.usable_width, dims.usable_height);
            ratio = dims.usable_width / dims.screen_width;
            // if (this.the('dimensions') !== undefined) {
            //  position_helper.update_level_dims(this.the('dimensions').width, this.the('dimensions').height);
            // }

            renderer.setSize(dims.usable_width, dims.usable_height);

            camera.aspect = dims.usable_width / dims.usable_height;
            camera.updateProjectionMatrix();
        },

        //TODO: can we make this callback function?
        // dimensions: function(width, height) {
        //  return {width: width, height: height};
        // },

        //socket-event callback
         

        //invoked by framework
        connect_to_server: function() {
            var socket = io.connect('/desktop');

            if (window.document.hasFocus() && !options.observer) { 
                socket.emit('unpause'); 
            }
            
            socket.on('disconnect', disconnected);
            socket.on('connect', connected);
            socket.on('game_state/setup', setup);
            socket.on('game_state/update', update);
            socket.on('error', function(data) { throw Error(data); });

            if (!options.controls.indexOf("keyboard") !== -1) {
                keyboard_controller(socket, element, pendingAcknowledgements.flush.bind(pendingAcknowledgements));
            }
        }
    });

    $(".fullscreen").on('click', function() { if (screenfull.enabled) { screenfull.toggle(); } });
    $(".sound-off").hide();
    $(".sound-on").on('click', function() {
        $(".sound-on").hide();
        $(".sound-off").show();

        sound_manager.mute();           
    });
    $(".sound-off").on('click', function() {
        $(".sound-off").hide();
        $(".sound-on").show();

        sound_manager.unmute();         
    });

    return display;
};