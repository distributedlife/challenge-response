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
	  	{ name: 'complete', from: 'complete', to: 'ready' },
	  	{ name: 'false_start', from: '*', to: 'false_start' }
	  ]
	});
	fsm.onstate = function() {
		controller.state = fsm.current;
	};
	fsm.onenterchallenge_started = function() {
		controller.started = true;
	};
	var delayed = function() {
		if (controller.false_start) {
			return;
		}
		
		fsm.waiting();
	};
	var acknowledgement = function() {
		if (controller.false_start) {
			return;
		}

		controller.score = finish - start;
		fsm.response_accepted();
	};
	var reset = function() {
		controller.score = 0;
		controller.started = false;
		controller.false_start = false;
		fsm.cycle();
	};

	var false_start = function() {
		controller.false_start = true;
		controller.score = -1000;
		fsm.false_start();
	};

	_.extend(controller, {
		score: 0,
		state: 'ready',
		started: false,
		false_start: false,
		active: true,
		challenge_seen: function(ack) {
			start = ack.rcvd_timestamp;
		},
		anykey: function(force, data) {
			if (controller.state === 'ready') {
				fsm.cycle();
				timers.push(Object.create(delayed_effect((Math.random() * 6) + (Math.random() * 6), delayed)));
				return;
			}
			if (controller.state === 'waiting') {
				controller.false_start = true;
				controller.score = -1000;
				fsm.false_start();
				return;
			}
			if (controller.state === 'challenge_started') {
				finish = data.rcvd_timestamp;
				fsm.cycle();
				timers.push(Object.create(delayed_effect(1, acknowledgement)));
				return;
			}
		},
		update: function(dt) {
			_.each(timers, function(timer) {
				timer.tick(dt);
			});
			timers = _.reject(timers, function(t) { !t.is_alive(); });
		}
	});

	return controller;
};