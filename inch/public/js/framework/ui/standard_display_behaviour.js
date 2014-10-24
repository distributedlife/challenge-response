define(["zepto", "lodash", 'socket.io-client', "vendor/screenfull", "framework/keyboard_controller", "framework/sound_manager", "framework/track_state_changes", "framework/stats", 'framework/text_format', 'lib/util/sequence'], 
	function($, _, io, screenfull, keyboard_controller, SoundManager, tracks_state_changes, stats, format, sequence) {
		
	"use strict";

	var pending_acknowledgements = [];
	var last_received_id = 0;

	var reset_pending_messages = function() {
		pending_acknowledgements = [];
	};

	var flush_pending_acks = function() {
		var pending = pending_acknowledgements;

		reset_pending_messages();

		return pending;
	};

	return function(element, width, height, options, setup_func, update_func) {
		var display = {};
		_.extend(display, tracks_state_changes);
		_.extend(display, {
        	sound_manager: new SoundManager(),
        	width: width,
        	height: height,
        	setup_complete: false,
        	prior_step: Date.now(),
        	temporary_effects: [],
        	permanent_effects: [],
        	changes: [],

        	acknowledge: function(name) {
        		pending_acknowledgements[pending_acknowledgements.length - 1].names.push(name);
        	},
        	update_display: function() {
        		if (this.value(this.is('paused'))) {
        			this.prior_step = Date.now();
        			return;
        		}

        		var now = Date.now();

      			var dt = (now - this.prior_step) / 1000;
      			this.prior_step = Date.now();

        		this.animate(dt);
        	},
        	animate: function(dt) { 
        		if (this.setup_complete) {
        			this.tick(dt); 
        		}
        	},
	        tick: function(dt) {
                _.each(this.permanent_effects, function(permanent_effect) { permanent_effect.tick(dt); });
                _.each(this.temporary_effects, function(temporary_effect) { temporary_effect.tick(dt); });

                var expired_effects = _.select(this.temporary_effects, function(temporary_effect) { !temporary_effect.is_alive(); });
                this.temporary_effects = _.reject(this.temporary_effects, function(temporary_effect) { !temporary_effect.is_alive(); });

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

			setup: function(state) {
				this.reset();
	            this.update_state(state);
	            setup_func();

	            if (this.value(this.is('paused'))) {
	            	display.sound_manager.pauseAll();
	            }

	            this.setup_complete = true;
	        },

	        resize: function(width, height) {
	        	this.width = width;
	        	this.height = height;
	        },

	        //TODO: can we make this callback function?
	        dimensions: function(width, height) {
	        	return {width: width, height: height};
	        },

	        update: function(packet) {
	        	stats( 'update-inch' ).start();

	        	pending_acknowledgements.push({
	        		id: packet.id,
	        		rcvd_timestamp: Date.now(),
	        		names: []
	        	});

	        	if (packet.id <= last_received_id) {
	        		return;
	        	}
	        	last_received_id = packet.id;

	            this.update_state(packet.game_state);

	            if (this.changed(this.the('dimensions'))) { 
	            	this.resize(this.width, this.height); 
	            }

	            if (this.changed(this.the('paused')) && this.value(this.is('paused'))) { 
	            	this.pause(); 
	            }
	            if (this.changed(this.the('paused')) && this.value(this.isnt('paused'))) { 
	            	this.resume(); 
	            }

	            if (this.changed(this.the('players'))) {  
	            	$('#player-count').text(format.number_to_3_chars(this.value(this.the('players'))));  
	            }
	            if (this.changed(this.the('observers'))) {  
	            	$('#observer-count').text(format.number_to_3_chars(this.value(this.the('observers'))));  
	            }

	            this.detect_changes_and_notify_observers();
	            stats( 'update-inch' ).end();

	            stats( 'update-game' ).start();
	            update_func();
	            stats( 'update-game' ).end();
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
	                keyboard_controller(socket, element, flush_pending_acks);
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
});