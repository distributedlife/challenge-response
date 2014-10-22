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
	  initial: 'a',  
	  events: [
	  	{ name: 'a', from: 'a', to: 'b' },    
	  	{ name: 'b', from: 'b', to: 'c' },    
	  	{ name: 'c', from: 'c', to: 'd' },    
	  	{ name: 'd', from: 'd', to: 'e' },
	  	{ name: 'e', from: 'e', to: 'a' }
	  ]
	});
	fsm.onstate = function() {
		controller.state = fsm.current;
		console.log(controller.state);
	};
	fsm.onenterc = function() {
		start = Date.now();
	};
	fsm.onenterd = function() {
		finish = Date.now();
	};
	var delayed = function() {
		fsm.b();
	};
	var acknowledgement = function() {
		controller.score = finish - start;
		fsm.d();
	};
	var reset = function() {
		controller.score = 0;
		fsm.cycle();
	};

	_.extend(controller, {
		score: 0,
		state: 'a',
		active: true,
		anykey: function() {
			if (controller.state === 'a') {
				fsm.cycle();
				timers.push(Object.create(delayed_effect(3, delayed)));
			}
			if (controller.state === 'c') {
				fsm.cycle();
				timers.push(Object.create(delayed_effect(1, acknowledgement)));
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