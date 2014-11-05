"use strict";

var $ = require("zepto-browserify").$;
var _ = require("lodash");
var io = require('socket.io-client');
var screenfull = require("../../vendor/screenfull");
var keyboard_controller = require("../keyboard_controller");
var SoundManager = require("../sound_manager");
var stats = require("../stats");
var format = require('../text_format');
var sequence = require('inch-sequence');
var position_helper = require("../../lib/ui/position_helper");
    

var pendingAcknowledgements = {
    acks: [],
    reset: function() {
        this.acks = [];
    },
    flush: function() {
        var pending = this.acks;

        this.reset();

        return pending;
    },
    add: function(packetId) {
        this.acks.push({ id: packetId, rcvd_timestamp: Date.now(), names: [] });
    },
    ackLast: function(name) {
        this.acks[this.acks.length - 1].names.push(name);
    }
}; 

var last_received_id = 0;

module.exports = function(element, initial_width, initial_height, options, setup_func, animate_func) {
	var display = {};
    var stateChanges = require("../track_state_changes");
	_.extend(display, {
    	sound_manager: new SoundManager(),
    	setup_complete: false,
    	prior_step: Date.now(),
    	temporary_effects: [],
    	permanent_effects: [],
    	changes: [],
    	position_helper: position_helper(initial_width, initial_height, initial_width, initial_height),

    	ratio: 1.0,
    	font_size: function(size) {
    		return size * this.ratio;
    	},
    	update_display: function() {
    		if (stateChanges.value(stateChanges.is('paused'))) {
    			this.prior_step = Date.now();
    			return;
    		}

    		var now = Date.now();

  			var dt = (now - this.prior_step) / 1000;
  			this.prior_step = Date.now();

    		this.animate(dt);
    	},
    	animate: function(dt) { 
            animate_func();

    		if (this.setup_complete) {
    			this.tick(dt); 
    		}
    	},
        tick: function(dt) {
            _.each(this.permanent_effects, function(permanent_effect) { permanent_effect.tick(dt); });
            _.each(this.temporary_effects, function(temporary_effect) { temporary_effect.tick(dt); });

            var expired_effects = _.select(this.temporary_effects, function(temporary_effect) { return !temporary_effect.is_alive(); });
            this.temporary_effects = _.reject(this.temporary_effects, function(temporary_effect) { return !temporary_effect.is_alive(); });

            this.expired_effects_func(expired_effects);
        },

        //TODO: can we make this a callback?
        expired_effects_func: function(expired_effects) {},

		pause: function() { 
			$('.paused').show(); $('#paused').show();
			display.sound_manager.pauseAll();
		},
        resume: function() { 
        	$('.paused').hide(); $('#paused').hide(); 
        	display.sound_manager.resumeAll();
        },

        disconnected: function() { $('.disconnected').show(); },
        connected: function() { $('.disconnected').hide(); },

        //TODO: pass in callback rather than implement in child?
        reset: function() {},

        //socket-event callback
		setup: function(state) {
			this.reset();
            stateChanges.update_state(state);
            setup_func(
                pendingAcknowledgements.ackLast.bind(pendingAcknowledgements), 
                this.position_helper, 
                this.permanent_effects, 
                this.font_size.bind(this), 
                stateChanges
            );

            if (stateChanges.value(stateChanges.is('paused'))) {
            	display.sound_manager.pauseAll();
            }
            // console.log(state.dimensions.width, state.dimensions.height)
            this.position_helper.update_level_dims(state.dimensions.width, state.dimensions.height);

            this.setup_complete = true;
        },

        //window-event callback
        resize: function(dims) {
        	this.position_helper.update_screen_dims(dims.usable_width, dims.usable_height);
        	this.ratio = dims.usable_width / dims.screen_width;
        	// if (this.the('dimensions') !== undefined) {
        	// 	this.position_helper.update_level_dims(this.the('dimensions').width, this.the('dimensions').height);
        	// }
        },

        //TODO: can we make this callback function?
        // dimensions: function(width, height) {
        // 	return {width: width, height: height};
        // },

        //socket-event callback
        update: function(packet) {
        	stats( 'update-inch' ).start();

            pendingAcknowledgements.add(packet.id);

        	if (packet.id <= last_received_id) {
        		return;
        	}
        	last_received_id = packet.id;

            stateChanges.update_state(packet.game_state);

            //TODO: fix this with the match board size to screen size
            // if (this.changed(this.the('dimensions'))) {
            // 	this.resize(this.width, this.height); 
            // }

            if (stateChanges.changed(stateChanges.the('paused')) && stateChanges.value(stateChanges.is('paused'))) { 
            	this.pause(); 
            }
            if (stateChanges.changed(stateChanges.the('paused')) && stateChanges.value(stateChanges.isnt('paused'))) { 
            	this.resume(); 
            }

            if (stateChanges.changed(stateChanges.the('players'))) {  
            	$('#player-count').text(format.number_to_3_chars(stateChanges.value(stateChanges.the('players'))));  
            }
            if (stateChanges.changed(stateChanges.the('observers'))) {  
            	$('#observer-count').text(format.number_to_3_chars(stateChanges.value(stateChanges.the('observers'))));  
            }

            stateChanges.detect_changes_and_notify_observers();
            stats( 'update-inch' ).end();
        }, 

        connect_to_server: function() {
            var socket = io.connect('/desktop');

            if (window.document.hasFocus() && !options.observer) { socket.emit('unpause'); }
            
            socket.on('disconnect', this.disconnected);
            socket.on('connect', this.connected);
            socket.on('game_state/setup', this.setup.bind(this));
            socket.on('game_state/update', this.update.bind(this));
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

		display.sound_manager.mute();			
	});
	$(".sound-off").on('click', function() {
		$(".sound-off").hide();
		$(".sound-on").show();

		display.sound_manager.unmute();			
	});

	return display;
};