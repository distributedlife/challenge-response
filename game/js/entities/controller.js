"use strict";

var rek = require('rekuire');
var _ = rek('lodash');
var requirejs = rek('requirejs')
requirejs.config({ baseUrl: 'inch/public/js' })

var updatable_entity = rek('updatable');
var StateMachine = rek('state_machine');
var delayed_effect_owner = requirejs('lib/util/delayed_effect_owner');

module.exports = function() {
	var controller = Object.create(updatable_entity("controller"));
	var start = 0;

	var state_machine = StateMachine({
	  initial: 'ready',  
	  events: [
	  	{ name: 'ready', from: 'ready', to: 'waiting' },    
	  	{ name: 'waiting', from: 'waiting', to: 'challenge_started' },    
	  	{ name: 'challenge_started', from: 'challenge_started', to: 'complete' },   
	  	{ name: 'reset', from: '*', to: 'ready' },
	  	{ name: 'false_start', from: '*', to: 'false_start' }
	  ],
	  callbacks: {
	  	onstate: function(event, from, to) { controller.state = this.current; },
	  }
	});

	var delayed = function() {
		if (state_machine.is('false_start')) {
			return;
		}
		
		state_machine.waiting();
	};

	var roll_up_an_unnerving_delay = function() {
		return Math.round(Math.random() * 6) + Math.round(Math.random() * 6);
	}

	_.extend(controller, {
		score: 0,
		state: 'ready',
		challenge_seen: function(ack) {
			start = ack.rcvd_timestamp;
		},
		response: function(force, data) {
			if (state_machine.is('ready')) {
				state_machine.cycle();
				controller.add_delayed_effect(roll_up_an_unnerving_delay(), delayed)
				return;
			}
			if (state_machine.is('waiting')) {
				state_machine.false_start();

				controller.cancel_all();

				return;
			}
			if (state_machine.is('challenge_started')) {
				state_machine.cycle();
				controller.score = data.rcvd_timestamp - start;
				return;
			}
		},
		reset: function(force, data) {
			if (controller.state === 'complete' || controller.state === "false_start") {
				state_machine.reset();
				controller.score = 0;
			}
		},
	});

	delayed_effect_owner(controller);

	return controller;
};