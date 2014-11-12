"use strict";

var _ = require('lodash');
var updatable_entity = require('inch-entity-updatable');
var StateMachine = require('javascript-state-machine');

module.exports = function() {
	var delayedEffects = require('inch-delayed-effects')();
	var start = 0;
	var controller = Object.create(updatable_entity("controller", delayedEffects.update));

	var state_machine = StateMachine.create({
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
		priorScores: [],
		challenge_seen: function(ack) {
			start = ack.rcvdTimestamp;
		},
		response: function(force, data) {
			if (state_machine.is('ready')) {
				state_machine.ready();
				delayedEffects.add(roll_up_an_unnerving_delay(), delayed)
				return;
			}
			if (state_machine.is('waiting')) {
				state_machine.false_start();

				delayedEffects.cancelAll();

				return;
			}
			if (state_machine.is('challenge_started')) {
				state_machine.challenge_started();
				controller.score = data.rcvd_timestamp - start;
				return;
			}
		},
		reset: function(force, data) {
			if (controller.state === 'complete' || controller.state === "false_start") {
				state_machine.reset();
				this.priorScores.push(controller.score);
				controller.score = 0;
			}
		},
	});

	return controller;
};