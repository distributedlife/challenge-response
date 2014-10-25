"use strict";

var rek = require('rekuire');
var _ = rek('lodash');
var requirejs = rek('requirejs')
requirejs.config({ baseUrl: 'inch/public/js' })

var basic_entity = rek('basic');
var StateMachine = rek('javascript-state-machine');
var delayed_effect = requirejs('lib/util/delayed_effect');

var state_machine = function(options) {
	var fsm = StateMachine.create(options);

	fsm.cycle = function() {
		fsm[fsm.current]();
	};

	return fsm;
}

module.exports = function() {
	var controller = Object.create(basic_entity("controller"));
	var timers = [];
	var start = 0;
	var finish = 0;

	var fsm = state_machine({
	  initial: 'ready',  
	  events: [
	  	{ name: 'ready', from: 'ready', to: 'waiting' },    
	  	{ name: 'waiting', from: 'waiting', to: 'challenge_started' },    
	  	{ name: 'challenge_started', from: 'challenge_started', to: 'response_accepted' },    
	  	{ name: 'response_accepted', from: 'response_accepted', to: 'complete' },
	  	{ name: 'reset', from: '*', to: 'ready' },
	  	{ name: 'false_start', from: '*', to: 'false_start' }
	  ],
	  callbacks: {
	  	onstate: function(event, from, to) { controller.state = this.current; },
	  }
	});

	var delayed = function() {
		if (fsm.is('false_start')) {
			return;
		}
		
		fsm.waiting();
	};
	var acknowledgement = function() {
		if (fsm.is('false_start')) {
			return;
		}

		controller.score = finish - start;
		fsm.response_accepted();
	};

	_.extend(controller, {
		score: 0,
		state: 'ready',
		active: true,
		challenge_seen: function(ack) {
			start = ack.rcvd_timestamp;
		},
		anykey: function(force, data) {
			if (controller.state === 'ready') {
				fsm.cycle();
				var delay = Math.round(Math.random() * 6) + Math.round(Math.random() * 6);
				timers.push(Object.create(delayed_effect(delay, delayed)));
				return;
			}
			if (controller.state === 'waiting') {
				controller.score = -1000;
				fsm.false_start();

				_.each(timers, function(timer) {
					timer.cancel();
				});

				return;
			}
			if (controller.state === 'challenge_started') {
				finish = data.rcvd_timestamp;
				fsm.cycle();
				timers.push(Object.create(delayed_effect(1, acknowledgement)));
				return;
			}
		},
		reset: function(force, data) {
			if (controller.state === 'complete' || controller.state === "false_start") {
				fsm.reset();
				controller.score = 0;
			}
		},
		update: function(dt) {
			_.each(timers, function(timer) { timer.tick(dt);});
			timers = _.reject(timers, function(t) { return !t.is_alive(); });
		}
	});

	return controller;
};